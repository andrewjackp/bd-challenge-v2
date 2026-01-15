export function requireShopFromProxy(url: URL) {
  const shop = url.searchParams.get("shop");
  if (!shop) throw new Response("Missing shop", { status: 401 });
  return shop;
}
