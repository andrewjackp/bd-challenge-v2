import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Page, Card, DataTable, Text } from "@shopify/polaris";

import { authenticate } from "../shopify.server";
import { listReviewsForProduct, productGidFromId } from "../models/review.server";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { admin, session } = await authenticate.admin(request);
  const shop = session.shop;

  const productId = params.productId!;
  const gid = productGidFromId(productId);

  // product title
  const res = await admin.graphql(
    `#graphql
    query ProductTitle($id: ID!) {
      product(id: $id) { id title }
    }`,
    { variables: { id: gid } }
  );
  const data = await res.json();
  const title = data?.data?.product?.title ?? "Product";

  const reviews = await listReviewsForProduct(shop, gid);

  const rows = reviews.map((r) => [
    `${r.rating} / 5`,
    r.message,
    new Date(r.createdAt).toLocaleString(),
  ]);

  return json({ title, rows });
};

export default function ProductReviews() {
  const { title, rows } = useLoaderData<typeof loader>();

  return (
    <Page
      title={`Reviews: ${title}`}
      backAction={{ content: "All reviews", url: "/app/reviews" }}
    >
      <Card padding="400">
        {rows.length === 0 ? (
          <Text as="p">No reviews for this product yet.</Text>
        ) : (
          <DataTable
            columnContentTypes={["numeric", "text", "text"]}
            headings={["Rating", "Message", "Created"]}
            rows={rows}
          />
        )}
      </Card>
    </Page>
  );
}
