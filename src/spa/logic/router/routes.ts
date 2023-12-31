import { IBasePage } from '@src/spa/view/pages/basePage/types';
import { PageNames } from '@src/spa/view/pages/types';
import { IRouter } from '@src/spa/logic/router/types';
import { APP_STATE_KEYS, IState } from '@src/spa/logic/state/types';
import State from '@src/spa/logic/state/state';
import {
  DEFAULT_BASKET_DATA,
  DEFAULT_PROFILE_DATA,
  ProfileData,
} from '@src/spa/logic/profile/profileDataManager/types';
import ProfileDataManager from '@src/spa/logic/profile/profileDataManager/profileDataManager';
import CatalogDataManager from '@src/spa/logic/catalog/catalogDataManager/catalogDataManager';
import PopUpView from '@src/spa/view/popUp/popUpView';
import { UNKNOWN_REQUEST_ERROR } from '@src/spa/logic/modalLogic/types';
import DataCatalog from '@src/spa/model/dataCatalog/dataCatalog';
import { Category } from '@commercetools/platform-sdk';
import { CustomBasketData } from '@src/spa/view/pages/basketPage/types';
import { ILoadSpinner } from '@src/spa/view/loadSpinner/types';
import LoadSpinnerView from '@src/spa/view/loadSpinner/loadSpinner';
import BasketManager from '@src/spa/logic/basket/basketManger/basketManger';
export interface IRoute {
  path: string;
  callback: (basePage: IBasePage, router: IRouter, path?: string) => void;
}

export const routes: IRoute[] = [
  {
    path: ``,
    callback: async (basePage: IBasePage): Promise<void> => {
      const { default: HomePageView } = await import('@src/spa/view/pages/homePage/homePageView'); // async import for lazy loading
      basePage.renderPage(new HomePageView());
    },
  },
  {
    path: `${PageNames.MAIN}`,
    callback: async (basePage: IBasePage): Promise<void> => {
      const { default: HomePageView } = await import('@src/spa/view/pages/homePage/homePageView');
      basePage.renderPage(new HomePageView());
    },
  },
  {
    path: `${PageNames.LOGIN}`,
    callback: async (basePage: IBasePage, router: IRouter): Promise<void> => {
      const { default: LoginPageView } = await import('@src/spa/view/pages/loginPage/loginPageView');
      const state: IState = State.getInstance();
      if (state.getRecord(APP_STATE_KEYS.AUTHORIZED) === 'true') {
        router.navigate(PageNames.MAIN, true);
      } else {
        basePage.renderPage(new LoginPageView(router));
      }
    },
  },
  {
    path: `${PageNames.REGISTRATION}`,
    callback: async (basePage: IBasePage, router: IRouter): Promise<void> => {
      const { default: RegistrationPageView } = await import(
        '@src/spa/view/pages/registrationPage/registrationPageView'
      );
      const state: IState = State.getInstance();
      if (state.getRecord(APP_STATE_KEYS.AUTHORIZED) === 'true') {
        router.navigate(PageNames.MAIN, true);
      } else {
        basePage.renderPage(new RegistrationPageView(router));
      }
    },
  },
  {
    path: `${PageNames.NOT_FOUND}`,
    callback: async (basePage: IBasePage, router: IRouter): Promise<void> => {
      const { default: NotFoundPageView } = await import('@src/spa/view/pages/notFoundPage/notFoundPageView');
      basePage.renderPage(new NotFoundPageView(router));
    },
  },
  {
    path: `${PageNames.ABOUT_US}`,
    callback: async (basePage: IBasePage): Promise<void> => {
      const { default: AboutUsPageView } = await import('@src/spa/view/pages/aboutUsPage/aboutUsPageView');
      basePage.renderPage(new AboutUsPageView());
    },
  },
  {
    path: `${PageNames.CATALOG}`,
    callback: async (basePage: IBasePage, router: IRouter): Promise<void> => {
      const { default: CatalogPageView } = await import('@src/spa/view/pages/catalogPage/catalogPageView');
      let params;
      const spinner: ILoadSpinner = new LoadSpinnerView();
      spinner.show();
      try {
        params = await CatalogDataManager.getInstance().getCatalogData();
      } catch {
        PopUpView.getRejectPopUp(UNKNOWN_REQUEST_ERROR).show();
      }
      if (!params) return;
      basePage.renderPage(new CatalogPageView(params, router));
      spinner.hide();
    },
  },
  {
    path: `${PageNames.CATALOG}/`,
    callback: async (basePage: IBasePage, router: IRouter, path?: string): Promise<void> => {
      const { default: CatalogPageView } = await import('@src/spa/view/pages/catalogPage/catalogPageView');
      if (!path) return;
      const spinner: ILoadSpinner = new LoadSpinnerView();
      spinner.show();
      const parts: string[] = path.split('/');
      const checkResult: boolean = await checkCatalogPass(parts, router);
      if (!checkResult) {
        spinner.hide();
        return;
      }

      try {
        if (parts.length === 2) {
          const params = await CatalogDataManager.getInstance().getCatalogData();
          if (!params) return;
          basePage.renderPage(new CatalogPageView(params, router, parts[1]));
        } else if (parts.length === 3) {
          const params = await CatalogDataManager.getInstance().getCatalogData();
          basePage.renderPage(new CatalogPageView(params, router, parts[1], parts[2]));
        } else {
          const params = await CatalogDataManager.getInstance().getProductById(parts[3]);
          if (!params) router.redirectToNotFoundPage(path);
          const { default: ProductPageView } = await import('@src/spa/view/pages/productPage/productPageView');
          basePage.renderPage(new ProductPageView(params));
        }
        spinner.hide();
      } catch {
        PopUpView.getRejectPopUp(UNKNOWN_REQUEST_ERROR).show();
        spinner.hide();
      }
    },
  },
  {
    path: `${PageNames.BASKET}`,
    callback: async (basePage: IBasePage): Promise<void> => {
      const { default: BasketPageView } = await import('@src/spa/view/pages/basketPage/basketPageView');
      const spinner: ILoadSpinner = new LoadSpinnerView();
      let params: CustomBasketData;
      try {
        spinner.show();
        params = await BasketManager.getInstance().getBasketData();
      } catch {
        params = DEFAULT_BASKET_DATA;
        PopUpView.getRejectPopUp(UNKNOWN_REQUEST_ERROR).show();
      }
      basePage.renderPage(new BasketPageView(params));
      spinner.hide();
    },
  },
  {
    path: `${PageNames.PROFILE}`,
    callback: async (basePage: IBasePage, router: IRouter): Promise<void> => {
      const { default: ProfilePageView } = await import('@src/spa/view/pages/profilePage/profilePageView');
      const state: IState = State.getInstance();
      if (state.getRecord(APP_STATE_KEYS.AUTHORIZED) !== 'true') {
        router.navigate(PageNames.LOGIN, true);
      } else {
        let params: ProfileData;
        const spinner: ILoadSpinner = new LoadSpinnerView();
        try {
          spinner.show();
          params = await ProfileDataManager.getInstance().getProfileData();
        } catch {
          params = DEFAULT_PROFILE_DATA;
          PopUpView.getRejectPopUp(UNKNOWN_REQUEST_ERROR).show();
        }
        basePage.renderPage(new ProfilePageView(params));
        spinner.hide();
      }
    },
  },
];

async function checkCatalogPass(parts: string[], router: IRouter): Promise<boolean> {
  try {
    if (parts.length === 2) {
      const categoryResp: Category = await DataCatalog.getInstance().getCategory(parts[1]);
      if (!categoryResp) throw new Error();
    } else {
      const resp = await DataCatalog.getInstance().getCategory(parts[1]);
      const resp2 = await DataCatalog.getInstance().getCategory(parts[2]);
      if (!resp || !resp2) throw new Error();
    }
    return true;
  } catch {
    router.redirectToNotFoundPage(parts.join('/'));
    return false;
  }
}
