/*
  Warnings:

  - The primary key for the `shopee_access_tokens` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `shopee_access_tokens` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `shops` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `shops` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `shop_id` on the `shopee_access_tokens` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `user_id` on the `shops` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "shopee_access_tokens" DROP CONSTRAINT "shopee_access_tokens_shop_id_fkey";

-- DropForeignKey
ALTER TABLE "shops" DROP CONSTRAINT "shops_user_id_fkey";

-- AlterTable
ALTER TABLE "shopee_access_tokens" DROP CONSTRAINT "shopee_access_tokens_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "shop_id",
ADD COLUMN     "shop_id" INTEGER NOT NULL,
ADD CONSTRAINT "shopee_access_tokens_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "shops" DROP CONSTRAINT "shops_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "user_id",
ADD COLUMN     "user_id" INTEGER NOT NULL,
ADD CONSTRAINT "shops_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "shopee_access_tokens_shop_id_key" ON "shopee_access_tokens"("shop_id");

-- AddForeignKey
ALTER TABLE "shops" ADD CONSTRAINT "shops_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopee_access_tokens" ADD CONSTRAINT "shopee_access_tokens_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shops"("id") ON DELETE CASCADE ON UPDATE CASCADE;
