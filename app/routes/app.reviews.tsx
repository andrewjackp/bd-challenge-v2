import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Page, Card, Text } from "@shopify/polaris";
import { authenticate } from "~/shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  return json({ ok: true, shop: session.shop });
};

export default function Reviews() {
  const data = useLoaderData<typeof loader>();
  return (
    <Page title="Reviews">
      <Card padding="400">
        <Text as="p">Loader OK: {String(data.ok)}</Text>
        <Text as="p">Shop: {data.shop}</Text>
      </Card>
    </Page>
  );
}
