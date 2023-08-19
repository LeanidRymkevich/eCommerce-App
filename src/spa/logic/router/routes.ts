import { IBasePage } from '@src/spa/view/pages/basePage/types';
import { PageNames } from '@src/spa/view/pages/types';
import { IRouter } from '@src/spa/logic/router/types';
import { APP_STATE_KEYS, IState } from '@src/spa/logic/state/types';
import State from '@src/spa/logic/state/state';

const state: IState = State.getInstance();

export interface IRoute {
  path: string;
  callback: (basePage: IBasePage, router: IRouter) => void;
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
      if (state.getRecord(APP_STATE_KEYS.AUTHORIZED) === 'true') {
        router.navigate(PageNames.MAIN);
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
      if (state.getRecord(APP_STATE_KEYS.AUTHORIZED) === 'true') {
        router.navigate(PageNames.MAIN);
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
    callback: async (basePage: IBasePage): Promise<void> => {
      const { default: CatalogPageView } = await import('@src/spa/view/pages/catalogPage/catalogPageView');
      basePage.renderPage(new CatalogPageView());
    },
  },
  {
    path: `${PageNames.BASKET}`,
    callback: async (basePage: IBasePage, router: IRouter): Promise<void> => {
      const { default: BasketPageView } = await import('@src/spa/view/pages/basketPage/basketPageView');
      if (state.getRecord(APP_STATE_KEYS.AUTHORIZED) !== 'true') {
        router.navigate(PageNames.LOGIN);
      } else {
        basePage.renderPage(new BasketPageView());
      }
    },
  },
  {
    path: `${PageNames.PROFILE}`,
    callback: async (basePage: IBasePage, router: IRouter): Promise<void> => {
      const { default: ProfilePageView } = await import('@src/spa/view/pages/profilePage/profilePageView');
      if (state.getRecord(APP_STATE_KEYS.AUTHORIZED) !== 'true') {
        router.navigate(PageNames.LOGIN);
      } else {
        basePage.renderPage(new ProfilePageView());
      }
    },
  },
  // TODO add paths for other pages by its templates
];
