import '@src/spa/view/pages/catalogPage/cardProduct/cardProduct.scss';
import { ElementCreatorParams } from '@src/spa/utils/elementCreator/types';
import ElementCreator from '@src/spa/utils/elementCreator/elementCreator';
import View from '@src/spa/view/view';
import * as constants from '@src/spa/view/pages/catalogPage/cardProduct/constants';
import { Category, Image, ProductProjection } from '@commercetools/platform-sdk';
import DataCatalog from '@src/spa/model/dataCatalog/dataCatalog';
import { PAGE_NAME_ATTRIBUTE } from '../../types';
import { IRouter } from '@src/spa/logic/router/types';
import BasketManager from '@src/spa/logic/basket/basketManger/basketManger';
import PopUpView from '@src/spa/view/popUp/popUpView';
import { ErrorMessages } from '@src/spa/logic/validator/types';

export default class CardProductView extends View {
  private id: string;
  private name: string;
  private produtsIdInBasket: string[];
  private isAddBasketFlag: boolean;

  private readonly router: IRouter;

  public constructor(data: ProductProjection, router: IRouter, productIdInbasket: string[]) {
    const params: ElementCreatorParams = {
      tag: 'div',
      classNames: ['catalog__card-product', `card-product`],
    };
    super(params);
    this.id = data.id;
    this.name = data.name['en-US'];
    this.router = router;
    this.produtsIdInBasket = productIdInbasket;
    this.isAddBasketFlag = this.produtsIdInBasket.includes(this.getIdProduct());
    this.configureView(data);
  }

  public getIdProduct() {
    return this.id;
  }

  private configureView(data: ProductProjection): void {
    this.getViewCreator().addInnerElement(
      this.createSaleSection(data.masterVariant.scopedPriceDiscounted).getElement(),
      this.createImgSection(data.masterVariant.images).getElement(),
      this.createNameSection(data.name['en-US']),
      this.createPriceSection(
        data.masterVariant.price?.value.centAmount,
        data.masterVariant.price?.discounted?.value.centAmount
      ).getElement(),
      this.createDescriptionSection(data.metaDescription ? `${data.metaDescription['en-US']}` : '').getElement(),
      this.createBasketAndOpenProductSection(data).getElement()
    );
  }
  private createSaleSection(flag: boolean | undefined) {
    const wrapper = new ElementCreator({ tag: 'div', classNames: ['card-product__wrapper-sale'] });
    const sale = new ElementCreator(constants.paramsSaleSection);
    sale.setTextContent('SALE');
    if (!flag) {
      sale.setClasses('hide');
    }
    wrapper.addInnerElement(sale.getElement());
    return wrapper;
  }
  private createImgSection(urlArr: Image[] | undefined) {
    const sale = new ElementCreator(constants.paramsImg);
    if (!urlArr) return sale;
    sale.setAttributes({ src: urlArr[0].url ? `${urlArr[0].url}` : '' });
    return sale;
  }
  private createPriceSection(fullPriceText: number | undefined, salePriceText: number | undefined) {
    const sale = new ElementCreator(constants.paramsPriceSection);
    const paramsFullPrice = {
      tag: 'span',
      classNames: ['card-product__full-price'],
    };
    const fullPrice = new ElementCreator(paramsFullPrice);
    fullPrice.setTextContent(fullPriceText ? `price: ${fullPriceText / 100}$` : '');
    sale.addInnerElement(fullPrice.getElement());
    if (salePriceText) {
      const paramsSalePrice = {
        tag: 'span',
        classNames: ['card-product__sale-price'],
      };
      fullPrice.setClasses('strikethrough-text');
      const salePrice = new ElementCreator(paramsSalePrice);
      salePrice.setTextContent(`sale: ${salePriceText / 100}$`);
      sale.addInnerElement(salePrice.getElement());
    }
    return sale;
  }

  private createNameSection(nameText: string) {
    const name = new ElementCreator(constants.paramsDescriptionSection);
    name.setTextContent(`${nameText}`);
    return name;
  }

  private createDescriptionSection(descriptionText: string) {
    const sale = new ElementCreator(constants.paramsDescriptionSection);
    sale.setTextContent(`${descriptionText}`);
    return sale;
  }

  private createBasketAndOpenProductSection(data: ProductProjection) {
    const section = new ElementCreator(constants.paramsBaskeAndOpenProductSection);
    const paramsBasketButton = {
      tag: 'button',
      classNames: ['card-product__basket-button'],
    };
    const basketButton = new ElementCreator(paramsBasketButton);
    if (this.isAddBasketFlag) {
      basketButton.setTextContent('remove');
      basketButton.setClasses('bc-silver');
    } else {
      basketButton.setTextContent('add to basket');
      basketButton.removeClasses('bc-silver');
    }
    basketButton.setListeners({
      event: 'click',
      callback: async (): Promise<void> => {
        if (!this.isAddBasketFlag) {
          try {
            await BasketManager.getInstance().addProductInBasket(this.getIdProduct());
            basketButton.setTextContent('remove');
            basketButton.setClasses('bc-silver');
            this.isAddBasketFlag = true;
            PopUpView.getApprovePopUp(`${this.name} added to basket`).show();
          } catch {
            PopUpView.getRejectPopUp(ErrorMessages.ADD_PRODUCT_BASKET).show();
          }
        } else {
          try {
            await BasketManager.getInstance().removeProductInBasket(this.getIdProduct());
            basketButton.setTextContent('add to basket');
            basketButton.removeClasses('bc-silver');
            this.isAddBasketFlag = false;
            PopUpView.getApprovePopUp(`${this.name} removed from basket`).show();
          } catch {
            PopUpView.getRejectPopUp(ErrorMessages.REMOVE_PRODUCT_BASKET).show();
          }
        }
      },
    });
    const paramsOpenProductButton = {
      tag: 'button',
      classNames: ['card-product__open-product-button'],
      textContent: 'learn more...',
    };
    const openProductButton = new ElementCreator(paramsOpenProductButton);
    this.getPass(data).then((res) => {
      openProductButton.setAttributes({ [PAGE_NAME_ATTRIBUTE]: res });
      openProductButton.setListeners({
        event: 'click',
        callback: (): void => {
          this.router.navigate(res);
        },
      });
    });
    section.addInnerElement(basketButton.getElement(), openProductButton.getElement());
    return section;
  }

  private async getPass(data: ProductProjection): Promise<string> {
    const subcategoryID: string = data.categories[0].id;
    let response: Category | undefined = await DataCatalog.getInstance().getCategoryByID(subcategoryID);
    if (!response) throw new Error('Interaction with commerce tool error');
    const subcategoryName = response.name;

    response = await DataCatalog.getInstance().getCategoryByID(response.ancestors[0].id);
    if (!response) throw new Error('Interaction with commerce tool error');
    const categoryName = response.name;
    const path = `catalog/${categoryName['en-US']}/${subcategoryName['en-US']}/${this.id}`;
    return path;
  }
}
