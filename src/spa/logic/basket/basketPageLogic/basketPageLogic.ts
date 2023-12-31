import { CustomBasketData, IBasketPage } from '@src/spa/view/pages/basketPage/types';
import { IBasketPageLogic } from '@src/spa/logic/basket/basketPageLogic/types';
import { IBasketItem } from '@src/spa/view/pages/basketPage/basketItem/types';
import BasketManager from '@src/spa/logic/basket/basketManger/basketManger';
import PopUpView from '@src/spa/view/popUp/popUpView';
import { ErrorMessages } from '@src/spa/logic/validator/types';

export class BasketPageLogic implements IBasketPageLogic {
  private page: IBasketPage;

  public constructor(page: IBasketPage) {
    this.page = page;
  }

  public async reduceProductAmountBTNHandler(basketItem: IBasketItem): Promise<void> {
    const input = basketItem.getAmountInput();
    const id = basketItem.getProductId();
    const value: number = +input.value;

    if (value === 1) return;

    let customDataBasket: CustomBasketData;

    try {
      const cartResponse = await BasketManager.getInstance().changeQuantityProductInCart(value - 1, id);
      customDataBasket = BasketManager.getInstance().adapterDataBasket(cartResponse);
    } catch {
      PopUpView.getRejectPopUp(ErrorMessages.CHANGE_QUANTITY_PRODUCT_ITEMS).show();
      return;
    }

    input.value = `${value - 1}`;

    const productFromCartResponse = customDataBasket.products.filter((el) => el.id === id)[0];
    basketItem.changeProductPriceAndDiscountedPrice(
      productFromCartResponse.price,
      productFromCartResponse.discountPrice
    );

    this.page.changeTotalAndDiscountedTotalPrices(customDataBasket.totalPrice, customDataBasket.discountPrice);
  }

  public async increaseProductAmountBTNHandler(basketItem: IBasketItem): Promise<void> {
    const input = basketItem.getAmountInput();
    const id = basketItem.getProductId();
    const value: number = +input.value;

    if (value === 99) return;

    let customDataBasket: CustomBasketData;

    try {
      const cartResponse = await BasketManager.getInstance().changeQuantityProductInCart(value + 1, id);
      customDataBasket = BasketManager.getInstance().adapterDataBasket(cartResponse);
    } catch {
      PopUpView.getRejectPopUp(ErrorMessages.CHANGE_QUANTITY_PRODUCT_ITEMS).show();
      return;
    }

    input.value = `${value + 1}`;

    const productFromCartResponse = customDataBasket.products.filter((el) => el.id === id)[0];
    basketItem.changeProductPriceAndDiscountedPrice(
      productFromCartResponse.price,
      productFromCartResponse.discountPrice
    );

    this.page.changeTotalAndDiscountedTotalPrices(customDataBasket.totalPrice, customDataBasket.discountPrice);
  }

  public async changheProductAmountInputHandler(basketItem: IBasketItem): Promise<void> {
    const input = basketItem.getAmountInput();
    const id = basketItem.getProductId();
    let value: number;

    if (+input.value > 99) {
      value = 99;
    } else if (+input.value < 1) {
      value = 1;
    } else {
      value = +input.value;
    }

    let customDataBasket: CustomBasketData;

    try {
      const cartResponse = await BasketManager.getInstance().changeQuantityProductInCart(value, id);
      customDataBasket = BasketManager.getInstance().adapterDataBasket(cartResponse);
    } catch {
      PopUpView.getRejectPopUp(ErrorMessages.CHANGE_QUANTITY_PRODUCT_ITEMS).show();
      return;
    }

    input.value = `${value}`;

    const productFromCartResponse = customDataBasket.products.filter((el) => el.id === id)[0];
    basketItem.changeProductPriceAndDiscountedPrice(
      productFromCartResponse.price,
      productFromCartResponse.discountPrice
    );

    this.page.changeTotalAndDiscountedTotalPrices(customDataBasket.totalPrice, customDataBasket.discountPrice);
  }

  public async removeProductFromBasket(basketItem: IBasketItem): Promise<void> {
    let customDataBasket: CustomBasketData;

    try {
      const cartResponse = await BasketManager.getInstance().removeProductInBasket(basketItem.getData().id);
      customDataBasket = BasketManager.getInstance().adapterDataBasket(cartResponse);
    } catch (err) {
      PopUpView.getRejectPopUp(ErrorMessages.REMOVE_PRODUCT_BASKET).show();
      return;
    }

    PopUpView.getApprovePopUp(`${basketItem.getData().name} removed from cart`).show();

    const removingResult: boolean = this.page.removeProduct(basketItem);

    if (!removingResult) return;

    this.page.changeTotalAndDiscountedTotalPrices(customDataBasket.totalPrice, customDataBasket.discountPrice);
  }

  public async clearBasket(applyPromocode: boolean): Promise<void> {
    try {
      await BasketManager.getInstance().removeAllProductsInBasket();
      if (applyPromocode) await BasketManager.getInstance().deletePromoCode();
    } catch {
      PopUpView.getRejectPopUp(ErrorMessages.CLEAR_BASKET).show();
      return;
    }

    PopUpView.getApprovePopUp('All items have been removed from the cart').show();

    this.page.clearBasket();
  }

  public async setPromoCode(promocodeInput: HTMLInputElement): Promise<void> {
    const promocode = promocodeInput.value;
    let customDataBasket: CustomBasketData;
    try {
      const cartResponse = await BasketManager.getInstance().setPromoCode(promocode);
      customDataBasket = BasketManager.getInstance().adapterDataBasket(cartResponse);
    } catch (err) {
      if (!(err instanceof Error)) return;
      PopUpView.getRejectPopUp(err.message).show();
      return;
    }

    promocodeInput.value = '';
    PopUpView.getApprovePopUp(`You used a promotional code`).show();
    this.page.changeTotalAndDiscountedTotalPrices(customDataBasket.totalPrice, customDataBasket.discountPrice);
  }

  public async deletePromoCode(): Promise<void> {
    let customDataBasket: CustomBasketData;
    try {
      const cartResponse = await BasketManager.getInstance().deletePromoCode();
      customDataBasket = BasketManager.getInstance().adapterDataBasket(cartResponse);
    } catch {
      PopUpView.getRejectPopUp(`An error occurred when resetting the promotional code`).show();
      return;
    }
    PopUpView.getApprovePopUp(`You have reset your promo code`).show();
    this.page.changeTotalAndDiscountedTotalPrices(customDataBasket.totalPrice, customDataBasket.discountPrice);
  }
}
