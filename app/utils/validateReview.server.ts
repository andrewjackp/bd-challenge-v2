export function parseReviewPayload(payload: any) {
  const rating = Number(payload?.rating);
  const message = String(payload?.message ?? "").trim();
  const productId = String(payload?.productId ?? "").trim();
  const customerName = payload?.customerName ? String(payload.customerName).trim() : undefined;

  if (!productId) throw new Response("Missing productId", { status: 400 });
  if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
    throw new Response("Rating must be 1-5", { status: 400 });
  }
  if (!message || message.length < 2) throw new Response("Message required", { status: 400 });

  return { productId, rating: Math.trunc(rating), message, customerName };
}
