import { ProductCard } from "../components/ProductCard";

export function ProductList ({ products }) {
    return (
        <ul>
            {products.map(product => (
                <li key={product.id}>
                    <ProductCard product={product} />
                </li>
            ))}
        </ul>
    );
}