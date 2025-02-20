import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

// Fake product data
const products = [
  { id: "1", name: "Product One" },
  { id: "2", name: "Product Two" }
];

// SERVER: Runs before the page loads
export const loader = async () => {
  return json({ products });
};

// CLIENT: Uses the data
export default function Products() {
  const { products } = useLoaderData<typeof loader>();

  return (
    <div>
      <h1>Products</h1>
      <ul>
        {products.map(product => (
          <li key={product.id}>
            <a href={`/products/${product.id}`}>{product.name}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}