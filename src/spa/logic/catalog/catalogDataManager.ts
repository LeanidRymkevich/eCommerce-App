//import {} from '@src/spa/logic/catalog/types';
import DataCatalog from '@src/spa/model/dataCatalog/dataCatalog';
import { CatalogData } from './types';
import { ProductProjection } from '@commercetools/platform-sdk';

export default class CatalogDataManager /* implements IProfileDataManager */ {
  private static readonly instance = new CatalogDataManager();

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  public static getInstance() {
    return this.instance;
  }

  public async getCatalogData(): Promise<CatalogData> {
    const allCategories = await this.getCatalogs();
    const allProducts: ProductProjection[] = (await this.getProducts()).body.results;
    console.log(allCategories, allProducts);
    return {
      allCategories: allCategories,
      allProducts: allProducts,
    };
  }
  public async getCatalogs() {
    const dataCatalogResponse = await DataCatalog.getInstance().getCatalogs();
    return dataCatalogResponse.body.results;
  }

  public async getProducts() {
    const dataCatalogResponse = await DataCatalog.getInstance().getProducts();
    return dataCatalogResponse;
  }

  public async getCategoryId(categoryName: string) {
    const dataCatalogResponse = await DataCatalog.getInstance().getCategory(categoryName);
    console.log(dataCatalogResponse);
  }
  public async getProductsFromCategory(categoryName: string) {
    const dataCatalogResponse = await DataCatalog.getInstance().getProductsFromCategory(categoryName);
    console.log(dataCatalogResponse.body.results);
  }

  //private getToken(): TokenStore {
  //  const state: IState = State.getInstance();
  //  const token: string = state.getRecord(APP_STATE_KEYS.TOKEN);
  //  return JSON.parse(token);
  //}
}
