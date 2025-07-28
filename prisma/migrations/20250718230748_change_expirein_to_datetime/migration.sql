/*
  Warnings:

  - Changed the type of `expire_in` on the `shopee_access_tokens` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "shopee_access_tokens" DROP COLUMN "expire_in",
ADD COLUMN     "expire_in" TIMESTAMP(3) NOT NULL;
