import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";

import {
  createReview,
  listReviewsForProduct,
  productGidFromId,
} from "../models/review.server";

function requireShop(url: URL) {
  const shop = url.searchParams.get("shop");
  if (!shop) throw new Response("Missing shop", { status: 401 });
  return shop;
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  console.log("PROXY HIT (GET)", request.url);

  const url = new URL(request.url);
  const shop = requireShop(url);

  const productId = url.searchParams.get("productId");
  if (!productId) {
    return json({ ok: false, error: "Missing productId" }, { status: 400 });
  }

  const reviews = await listReviewsForProduct(shop, productGidFromId(productId));
  return json({ ok: true, reviews });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  console.log("PROXY HIT (POST)", request.url);

  const url = new URL(request.url);
  const shop = requireShop(url);

  const body = await request.json().catch(() => null);

  const productId = String(body?.productId ?? "").trim();
  const rating = Number(body?.rating);
  const message = String(body?.message ?? "").trim();

  if (!productId) return json({ ok: false, error: "Missing productId" }, { status: 400 });
  if (!Number.isFinite(rating) || rating < 1 || rating > 5)
    return json({ ok: false, error: "Rating must be 1..5" }, { status: 400 });
  if (!message) return json({ ok: false, error: "Message required" }, { status: 400 });

  const review = await createReview({
    shop,
    productGid: productGidFromId(productId),
    rating,
    message,
  });

  return json({ ok: true, review });
};
