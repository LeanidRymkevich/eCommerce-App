import '@src/spa/view/pages/catalogPage/cardProduct/cardProduct.scss';
import { ElementCreatorParams } from '@src/spa/utils/elementCreator/types';
import ElementCreator from '@src/spa/utils/elementCreator/elementCreator';
import View from '@src/spa/view/view';
import * as constants from '@src/spa/view/pages/catalogPage/cardProduct/constants';
import { Image, ProductProjection } from '@commercetools/platform-sdk';

export default class CardProductView extends View {
  private id: string;
  public constructor(data: ProductProjection) {
    const params: ElementCreatorParams = {
      tag: 'div',
      classNames: ['catalog__card-product', `card-product`],
    };
    super(params);
    this.id = data.id;
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
      this.createBasketAndOpenProductSection().getElement()
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

  private createBasketAndOpenProductSection() {
    const section = new ElementCreator(constants.paramsBaskeAndOpenProductSection);
    const paramsBasketButton = {
      tag: 'button',
      classNames: ['card-product__basket-button'],
      textContent: 'Add to Basket',
    };
    const basketButton = new ElementCreator(paramsBasketButton);
    const paramsOpenProductButton = {
      tag: 'button',
      classNames: ['card-product__open-product-button'],
      textContent: 'Learn more...',
    };
    const openProductButton = new ElementCreator(paramsOpenProductButton);
    section.addInnerElement(basketButton.getElement(), openProductButton.getElement());
    return section;
  }
}
