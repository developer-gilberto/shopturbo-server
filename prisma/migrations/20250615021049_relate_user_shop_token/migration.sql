/*
  Warnings:

  - You are about to drop the `access_token` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `shop` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updated_at` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "access_token" DROP CONSTRAINT "access_token_shop_id_fkey";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "access_token";

-- DropTable
DROP TABLE "shop";

-- CreateTable
CREATE TABLE "shops" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "name" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shops_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shopee_access_tokens" (
    "id" UUID NOT NULL,
    "shop_id" UUID NOT NULL,
    "refresh_token" TEXT NOT NULL,
    "access_token" TEXT NOT NULL,
    "expire_in" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shopee_access_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "shopee_access_tokens_shop_id_key" ON "shopee_access_tokens"("shop_id");

-- CreateIndex
CREATE UNIQUE INDEX "shopee_access_tokens_refresh_token_key" ON "shopee_access_tokens"("refresh_token");

-- AddForeignKey
ALTER TABLE "shops" ADD CONSTRAINT "shops_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopee_access_tokens" ADD CONSTRAINT "shopee_access_tokens_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shops"("id") ON DELETE CASCADE ON UPDATE CASCADE;
