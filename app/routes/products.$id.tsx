import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { authenticate } from "../shopify.server";

export const loader = async ({ request, params }: any) => {
  const { admin } = await authenticate(request);
  const api = admin.api;

  const response = await api.graphql(
    `{
      product(id: "gid://shopify/Product/${params.id}") {
        id
        title
        description
        featuredImage {
          url
        }
      }
    }`
  );

  if (!response?.data?.product) {
    throw new Response("Product not found", { status: 404 });
  }

  return json({ product: response.data.product });
};

export default function ProductDetail() {
  const { product } = useLoaderData<typeof loader>();

  return (
    <section>
      <h1>{product.title}</h1>
      <img
        src={product.featuredImage?.url ?? "/placeholder.png"}
        alt={product.title || "Product image"}
        width="200"
      />
      <p>{product.description}</p>
      <a href="/products">Back to products</a>
    </section>
  );
}
