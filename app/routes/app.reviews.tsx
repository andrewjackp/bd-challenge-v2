import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Page, Card, DataTable, Text, Badge } from "@shopify/polaris";

import { authenticate } from "../shopify.server";
import { listRecentReviewsForShop } from "../models/review.server";

function productIdFromGid(gid: string) {
  return gid.split("/").pop()!;
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin, session } = await authenticate.admin(request);
  const shop = session.shop;

  const reviews = await listRecentReviewsForShop(shop, 250);

  // Group in-memory (simple + reliable for submissions)
  const groups = new Map<
    string,
    { productGid: string; count: number; sum: number }
  >();

  for (const r of reviews) {
    const existing = groups.get(r.productGid);
    if (existing) {
      existing.count += 1;
      existing.sum += r.rating;
    } else {
      groups.set(r.productGid, { productGid: r.productGid, count: 1, sum: r.rating });
    }
  }

  const productGids = [...groups.keys()];

  // Fetch product titles (nodes)
  const productsById = new Map<string, { title: string }>();
  if (productGids.length) {
    const res = await admin.graphql(
      `#graphql
      query ProductsByIds($ids: [ID!]!) {
        nodes(ids: $ids) {
          ... on Product { id title }
        }
      }`,
      { variables: { ids: productGids } }
    );

    const data = await res.json();
    for (const node of data?.data?.nodes ?? []) {
      if (node?.id) productsById.set(node.id, { title: node.title });
    }
  }

  const rows = productGids
    .map((gid) => {
      const g = groups.get(gid)!;
      const title = productsById.get(gid)?.title ?? "(Product not found)";
      const avg = Math.round((g.sum / g.count) * 10) / 10;
      const productId = productIdFromGid(gid);

      return {
        gid,
        title,
        count: g.count,
        avg,
        productId,
      };
    })
    .sort((a, b) => b.count - a.count);

  return json({ rows });
};

export default function ReviewsIndex() {
  const { rows } = useLoaderData<typeof loader>();

  const tableRows = rows.map((r) => [
    <Text as="span" fontWeight="semibold" key={r.gid}>
      <Link to={`/app/reviews/${r.productId}`}>{r.title}</Link>
    </Text>,
    <Badge key={`${r.gid}-count`}>{r.count}</Badge>,
    <Text as="span" key={`${r.gid}-avg`}>{r.avg} / 5</Text>,
  ]);

  return (
    <Page title="Reviews">
      <Card padding="400">
        {rows.length === 0 ? (
          <Text as="p">No reviews yet. Add the “Review embed” block to a product page and submit a review.</Text>
        ) : (
          <DataTable
            columnContentTypes={["text", "text", "numeric"]}
            headings={["Product", "Reviews", "Average"]}
            rows={tableRows}
          />
        )}
      </Card>
    </Page>
  );
}
