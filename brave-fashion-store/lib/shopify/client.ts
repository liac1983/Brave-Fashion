type ShopifyFetchParams = {
  query: string;
  variables?: Record<string, unknown>;
};

type ShopifyError = {
  message: string;
  extensions?: {
    code?: string;
    [key: string]: unknown;
  };
};

type ShopifyResponse<T> = {
  data?: T;
  errors?: ShopifyError[];
};

export async function shopifyFetch<T>({
  query,
  variables = {},
}: ShopifyFetchParams): Promise<T> {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  if (!domain) {
    throw new Error("Missing SHOPIFY_STORE_DOMAIN");
  }

  if (!token) {
    throw new Error("Missing SHOPIFY_STOREFRONT_ACCESS_TOKEN");
  }

  const response = await fetch(`https://${domain}/api/2024-01/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
    cache: "no-store",
  });

  const result: ShopifyResponse<T> = await response.json();

  if (!response.ok) {
    throw new Error(
      `Shopify request failed with status ${response.status}: ${JSON.stringify(result.errors ?? result)}`
    );
  }

  if (result.errors?.length) {
    throw new Error(JSON.stringify(result.errors, null, 2));
  }

  if (!result.data) {
    throw new Error("Shopify response did not include data.");
  }

  return result.data;
}