import '@src/spa/view/topMenu/topMenu.scss';
import { ElementCreatorParams, IElementCreator } from '@src/spa/utils/elementCreator/types';
import ElementCreator from '@src/spa/utils/elementCreator/elementCreator';
import ButtonView from '@src/spa/view/button/buttonView';
import { btnParams } from '@src/spa/view/button/types';
import { PAGE_NAME_ATTRIBUTE, PageNames } from '@src/spa/view/pages/types';
import { HIDDEN_CLASS } from '@src/spa/view/header/types';
import View from '@src/spa/view/view';
import { IRouter } from '@src/spa/logic/router/types';
import { IHeaderController } from '@src/spa/logic/controller/headerController/types';
import HeaderController from '@src/spa/logic/controller/headerController/headerController';

const DEFAULT_USER_NAME = '?';

// topMenu properties
const CONTAINER_TAG = 'div';
const CONTAINER_CLASS_NAME = 'top-menu';
const USER_BAR_TAG = 'div';
const USER_BAR_CLASS_NAME = 'top-menu__user-bar';

// nav properties
const NAV_TAG = 'nav';
const NAV_CLASS_NAME = 'nav';

// nav BTN properties
const NAV_BTN_CLASS_NAME = 'btn_nav';
const MAIN_BTN_TEXT = 'Main';
const CATALOG_BTN_TEXT = 'Catalog';
const ABOUT_US_BTN_TEXT = 'About Us';

// BTN properties
const AUTHORIZATION_BTN_CLASS_NAME = 'btn_authorization';
const BASKET_BTN_CLASS_NAME = 'btn_basket';
const SING_IN_BTN_TEXT = 'Sing in';
const SING_OUT_BTN_TEXT = 'Sing out';
const REGISTER_TEXT = 'Sign up'; // or register if someone wishes
const BASKET_TEXT = '';

export default class TopMenuView extends View {
  private readonly mainBTN: IElementCreator;
  private readonly catalogBTN: IElementCreator;
  private readonly aboutUsBTN: IElementCreator;
  private readonly singInBTN: IElementCreator;
  private readonly singOutBTN: IElementCreator;
  private readonly registerBTN: IElementCreator;
  private readonly userBar: IElementCreator;
  private readonly basket: IElementCreator;
  private controller: IHeaderController | null = null;

  constructor() {
    const params: ElementCreatorParams = {
      tag: CONTAINER_TAG,
      classNames: [CONTAINER_CLASS_NAME],
    };
    super(params);

    this.mainBTN = this.createMainBTN();
    this.catalogBTN = this.createCatalogBTN();
    this.aboutUsBTN = this.createAboutUsBTN();
    this.singInBTN = this.createSingInBTN();
    this.singOutBTN = this.createSingOutBTN();
    this.registerBTN = this.createRegisterBTN();
    this.userBar = this.createUserBar();
    this.basket = this.createBasket();

    this.changeCaption();

    this.configureView();
  }

  private configureView(): void {
    const navParams: ElementCreatorParams = {
      tag: NAV_TAG,
      classNames: [NAV_CLASS_NAME],
    };
    const nav = new ElementCreator(navParams);
    nav.addInnerElement(this.mainBTN, this.catalogBTN, this.aboutUsBTN);

    this.singOutBTN.setClasses(HIDDEN_CLASS);

    this.getViewCreator().addInnerElement(
      nav,
      this.singInBTN,
      this.singOutBTN,
      this.registerBTN,
      this.basket,
      this.userBar
    );
  }

  public setController(router: IRouter): void {
    this.controller = new HeaderController(router);
  }

  public hideUserBar(): void {
    this.userBar.setClasses(HIDDEN_CLASS);
  }

  public showUserBar(): void {
    this.userBar.removeClasses(HIDDEN_CLASS);
  }

  public hideSignOutBTN(): void {
    this.singOutBTN.setClasses(HIDDEN_CLASS);
  }

  public showSignOutBTN(): void {
    this.singOutBTN.removeClasses(HIDDEN_CLASS);
  }

  public hideSignInBTN(): void {
    this.singInBTN.setClasses(HIDDEN_CLASS);
  }

  public showSignInBTN(): void {
    this.singInBTN.removeClasses(HIDDEN_CLASS);
  }

  public hideRegisterBTN(): void {
    this.registerBTN.setClasses(HIDDEN_CLASS);
  }

  public showRegisterBTN(): void {
    this.registerBTN.removeClasses(HIDDEN_CLASS);
  }

  public getMainBTN(): IElementCreator {
    return this.mainBTN;
  }

  public getCatalogBTN(): IElementCreator {
    return this.catalogBTN;
  }

  public getAboutUsBTN(): IElementCreator {
    return this.aboutUsBTN;
  }

  public getSingInBTN(): IElementCreator {
    return this.singInBTN;
  }

  public getSingOutBTN(): IElementCreator {
    return this.singOutBTN;
  }

  public getRegisterBTN(): IElementCreator {
    return this.registerBTN;
  }

  public getUserBar(): IElementCreator {
    return this.userBar;
  }

  public getBasket(): IElementCreator {
    return this.basket;
  }

  public changeCaption(userName: string = DEFAULT_USER_NAME): void {
    this.userBar.setTextContent(userName[0]);
  }

  private createMainBTN(): IElementCreator {
    const params: btnParams = {
      textContent: MAIN_BTN_TEXT,
      classNames: [NAV_BTN_CLASS_NAME],
    };

    const button: IElementCreator = new ButtonView(params).getViewCreator();
    button.setAttributes({ [PAGE_NAME_ATTRIBUTE]: PageNames.MAIN });
    button.setListeners({
      event: 'click',
      callback: (): void => {
        if (!this.controller) throw new Error('There is no controller in top menu view!');
        this.controller.goTo(button.getElement());
      },
    });
    return button;
  }

  private createCatalogBTN(): IElementCreator {
    const params: btnParams = {
      textContent: CATALOG_BTN_TEXT,
      classNames: [NAV_BTN_CLASS_NAME],
    };

    const button: IElementCreator = new ButtonView(params).getViewCreator();
    button.setAttributes({ [PAGE_NAME_ATTRIBUTE]: PageNames.CATALOG });
    button.setListeners({
      event: 'click',
      callback: (): void => {
        if (!this.controller) throw new Error('There is no controller in top menu view!');
        this.controller.goTo(button.getElement());
      },
    });
    return button;
  }

  private createAboutUsBTN(): IElementCreator {
    const params: btnParams = {
      textContent: ABOUT_US_BTN_TEXT,
      classNames: [NAV_BTN_CLASS_NAME],
    };

    const button: IElementCreator = new ButtonView(params).getViewCreator();
    button.setAttributes({ [PAGE_NAME_ATTRIBUTE]: PageNames.ABOUT_US });
    button.setListeners({
      event: 'click',
      callback: (): void => {
        if (!this.controller) throw new Error('There is no controller in top menu view!');
        this.controller.goTo(button.getElement());
      },
    });
    return button;
  }

  private createSingInBTN(): IElementCreator {
    const params: btnParams = {
      textContent: SING_IN_BTN_TEXT,
      classNames: [AUTHORIZATION_BTN_CLASS_NAME],
    };

    const button: IElementCreator = new ButtonView(params).getViewCreator();
    button.setAttributes({ [PAGE_NAME_ATTRIBUTE]: PageNames.LOGIN });
    button.setListeners({
      event: 'click',
      callback: (): void => {
        if (!this.controller) throw new Error('There is no controller in top menu view!');
        this.controller.goTo(button.getElement());
      },
    });
    return button;
  }

  private createSingOutBTN(): IElementCreator {
    const params: btnParams = {
      textContent: SING_OUT_BTN_TEXT,
      classNames: [AUTHORIZATION_BTN_CLASS_NAME],
    };

    const button: IElementCreator = new ButtonView(params).getViewCreator();
    button.setAttributes({ [PAGE_NAME_ATTRIBUTE]: PageNames.LOGIN });
    button.setListeners({
      event: 'click',
      callback: (): void => {
        if (!this.controller) throw new Error('There is no controller in top menu view!');
        this.controller.signOut(button.getElement());
      },
    });
    return button;
  }

  private createRegisterBTN(): IElementCreator {
    const params: btnParams = {
      textContent: REGISTER_TEXT,
      classNames: [AUTHORIZATION_BTN_CLASS_NAME],
    };

    const button: IElementCreator = new ButtonView(params).getViewCreator();
    button.setAttributes({ [PAGE_NAME_ATTRIBUTE]: PageNames.REGISTRATION });
    button.setListeners({
      event: 'click',
      callback: (): void => {
        if (!this.controller) throw new Error('There is no controller in top menu view!');
        this.controller.goTo(button.getElement());
      },
    });
    return button;
  }

  private createUserBar(): IElementCreator {
    const userBarParams: ElementCreatorParams = {
      tag: USER_BAR_TAG,
      classNames: [USER_BAR_CLASS_NAME],
    };

    const button: IElementCreator = new ElementCreator(userBarParams);
    button.setAttributes({ [PAGE_NAME_ATTRIBUTE]: PageNames.PROFILE });
    button.setListeners({
      event: 'click',
      callback: (): void => {
        if (!this.controller) throw new Error('There is no controller in top menu view!');
        this.controller.goTo(button.getElement());
      },
    });
    return button;
  }

  private createBasket(): IElementCreator {
    const params: btnParams = {
      textContent: BASKET_TEXT,
      classNames: [BASKET_BTN_CLASS_NAME],
    };

    const button: IElementCreator = new ButtonView(params).getViewCreator();
    button.setAttributes({ [PAGE_NAME_ATTRIBUTE]: PageNames.BASKET });
    button.setListeners({
      event: 'click',
      callback: (): void => {
        if (!this.controller) throw new Error('There is no controller in top menu view!');
        this.controller.goTo(button.getElement());
      },
    });
    return button;
  }
}
