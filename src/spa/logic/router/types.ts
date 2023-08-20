export interface IRouter {
  navigate(url: string, replace?: boolean): void;
}

export const ID_TEMPLATE = '{id}';
export const QUERY_TEMPLATE = '{query}';

export interface URLParams {
  path: string;
  resource: string;
  queryString: string;
  queryParams: Record<string, string> | null;
}
