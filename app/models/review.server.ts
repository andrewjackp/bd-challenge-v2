import { prisma } from "../db.server";

export function listReviewsForProduct(shop: string, productGid: string) {
  return prisma.review.findMany({
    where: { shop, productGid },
    orderBy: { createdAt: "desc" },
  });
}

export function listRecentReviewsForShop(shop: string, take = 200) {
  return prisma.review.findMany({
    where: { shop },
    orderBy: { createdAt: "desc" },
    take,
  });
}

export async function createReview(input: {
  shop: string;
  productGid: string;
  rating: number;
  message: string;
  customerName?: string;
  customerEmail?: string;
}) {
  // minimal validation
  const rating = Math.max(1, Math.min(5, Math.trunc(input.rating)));
  const message = (input.message ?? "").trim();
  if (!message) throw new Response("Message required", { status: 400 });

  return prisma.review.create({
    data: {
      shop: input.shop,
      productGid: input.productGid,
      rating,
      message,
      customerName: input.customerName?.trim() || null,
      customerEmail: input.customerEmail?.trim() || null,
    },
  });
}
