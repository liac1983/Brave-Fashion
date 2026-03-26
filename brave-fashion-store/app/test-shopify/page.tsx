import { shopifyFetch } from "@/lib/shopify/client";

type TestQueryResponse = {
  products: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        handle: string;
      };
    }>;
  };
};

const TEST_QUERY = `
  query TestProducts {
    products(first: 3) {
      edges {
        node {
          id
          title
          handle
        }
      }
    }
  }
`;

export default async function TestShopifyPage() {
  try {
    const data = await shopifyFetch<TestQueryResponse>({
      query: TEST_QUERY,
    });

    return (
      <section className="py-12">
        <h1 className="text-3xl font-semibold">Teste Shopify</h1>
        <p className="mt-4 text-green-600">Ligação à Shopify feita com sucesso.</p>

        <div className="mt-8 space-y-4">
          {data.products.edges.map(({ node }) => (
            <div key={node.id} className="rounded-xl border p-4">
              <h2 className="text-lg font-medium">{node.title}</h2>
              <p className="text-sm text-neutral-500">{node.handle}</p>
            </div>
          ))}
        </div>
      </section>
    );
  } catch (error) {
    return (
      <section className="py-12">
        <h1 className="text-3xl font-semibold">Teste Shopify</h1>
        <p className="mt-4 text-red-600">Erro ao ligar à Shopify.</p>
        <pre className="mt-6 overflow-x-auto rounded-xl bg-neutral-100 p-4 text-sm">
          {error instanceof Error ? error.message : "Erro desconhecido"}
        </pre>
      </section>
    );
  }
}