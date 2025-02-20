import { Link } from "@remix-run/react";

export function ProductCard({ product }: { product: { id: string; name: string} }) {
    return (
        <article>
            <h1>{product.name}</h1>
            <Link to={`/products/${product.id}`}>
             <p>{product.name}</p>
            </Link>
        </article>
    );
}