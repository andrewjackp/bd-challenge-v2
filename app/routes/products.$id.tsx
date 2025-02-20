import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

const products = [
  { id: "1", name: "Product One", description: "This is Product One" },
  { id: "2", name: "Product Two", description: "This is Product Two" }
];

console.log(products);


export const loader = async ({ params }: { params : { id: string}}) => {
  const product = products.find(p => p.id === params.id);
  if (!product) throw new Response("Not Found", { status: 404 });
  return json({ product });
};

export default function ProductDetail() {
  const { product } = useLoaderData<typeof loader>();

  console.log(product);
  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <a href="/products">Back to Products</a>
    </div>
  );
}