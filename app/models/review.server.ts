import { prisma } from "../db.server";

export const productGidFromId = (productId: string) =>
  `gid://shopify/Product/${productId}`;

export function listReviewsForProduct(shop: string, productGid: string) {
  return prisma.review.findMany({
    where: { shop, productGid },
    orderBy: { createdAt: "desc" },
  });
}

export function listRecentReviewsForShop(shop: string, take = 250) {
  return prisma.review.findMany({
    where: { shop },
    orderBy: { createdAt: "desc" },
    take,
  });
}

export function createReview(input: {
  shop: string;
  productGid: string;
  rating: number;
  message: string;
}) {
  const rating = Math.max(1, Math.min(5, Math.trunc(input.rating)));
  const message = (input.message ?? "").trim();
  if (!message) throw new Response("Message required", { status: 400 });

  return prisma.review.create({
    data: { ...input, rating, message },
  });
}
