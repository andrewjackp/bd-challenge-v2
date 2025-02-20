import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { authenticate } from "../../shopify.server";

export const loader = async ({ request }: any) => {
  const { api } = await authenticate.admin(request);

  const response = await api.graphql(
    `{
      products(first: 10) {
        edges {
          node {
            id
            title
            handle
            description
            featuredImage {
              url
            }
          }
        }
      }
    }`
  );

  const products = response?.data?.products?.edges?.map(({ node }:any) => node) || [];

  return json({ products });
};

export default function ProductsPage() {
  const { products } = useLoaderData<typeof loader>();
  
  return (
    <section>
      <h1>Shopify Products</h1>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <a href={`/products/${product.id}`}>
              {product.featuredImage?.url && (
                <img src={product.featuredImage.url} alt={product.title} width="100" />
              )}
              <h2>{product.title}</h2>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}