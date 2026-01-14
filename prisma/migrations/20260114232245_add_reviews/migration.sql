-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shop" TEXT NOT NULL,
    "productGid" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "customerName" TEXT,
    "customerEmail" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "Review_shop_productGid_idx" ON "Review"("shop", "productGid");

-- CreateIndex
CREATE INDEX "Review_shop_createdAt_idx" ON "Review"("shop", "createdAt");
