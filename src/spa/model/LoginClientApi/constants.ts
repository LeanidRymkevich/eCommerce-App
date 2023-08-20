export const options = {
  projectKey: 'ecommerce-app2023',
  authMiddlewareOptions: {
    host: 'https://auth.europe-west1.gcp.commercetools.com',
    projectKey: 'ecommerce-app2023',
    credentials: {
      clientId: '5CtkecLYr54FhhzXfgya3yRC',
      clientSecret: 'Y0wVAYt9uSgpgJFn4_lP9r_mmFlYMlK0',
    },
    scopes: [
      'manage_my_payments:ecommerce-app2023 manage_my_quotes:ecommerce-app2023 view_published_products:ecommerce-app2023 manage_my_profile:ecommerce-app2023 view_categories:ecommerce-app2023 manage_my_quote_requests:ecommerce-app2023 manage_my_business_units:ecommerce-app2023 manage_my_shopping_lists:ecommerce-app2023 create_anonymous_token:ecommerce-app2023 view_project_settings:ecommerce-app2023 manage_my_orders:ecommerce-app2023',
    ],
    fetch,
  },
  httpMiddlewareOptions: {
    host: 'https://api.europe-west1.gcp.commercetools.com',
    fetch,
  },
  passwordMiddlewareOptions: {
    host: 'https://auth.europe-west1.gcp.commercetools.com',
    projectKey: 'ecommerce-app2023',
    credentials: {
      clientId: '5CtkecLYr54FhhzXfgya3yRC',
      clientSecret: 'Y0wVAYt9uSgpgJFn4_lP9r_mmFlYMlK0',
      user: {
        username: 'andrei.glava03@gmail.com',
        password: '555534Glava$',
      },
    },
    scopes: [
      `manage_my_payments:ecommerce-app2023 manage_my_quotes:ecommerce-app2023 view_published_products:ecommerce-app2023 manage_my_profile:ecommerce-app2023 view_categories:ecommerce-app2023 manage_my_quote_requests:ecommerce-app2023 manage_my_business_units:ecommerce-app2023 manage_my_shopping_lists:ecommerce-app2023 create_anonymous_token:ecommerce-app2023 view_project_settings:ecommerce-app2023 manage_my_orders:ecommerce-app2023`,
    ],
    fetch,
  },
};

// test2 client api

//const AuthURL = 'https://auth.europe-west1.gcp.commercetools.com'

//curl https://auth.europe-west1.gcp.commercetools.com/oauth/token \
//     --basic --user "5CtkecLYr54FhhzXfgya3yRC:Y0wVAYt9uSgpgJFn4_lP9r_mmFlYMlK0" \
//     -X POST \
//     -d "grant_type=client_credentials&scope=manage_my_payments:ecommerce-app2023 manage_my_quotes:ecommerce-app2023 view_published_products:ecommerce-app2023 manage_my_profile:ecommerce-app2023 view_categories:ecommerce-app2023 manage_my_quote_requests:ecommerce-app2023 manage_my_business_units:ecommerce-app2023 manage_my_shopping_lists:ecommerce-app2023 create_anonymous_token:ecommerce-app2023 view_project_settings:ecommerce-app2023 manage_my_orders:ecommerce-app2023"