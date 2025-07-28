-- CreateTable
CREATE TABLE "shop" (
    "id" INTEGER NOT NULL,
    "name" TEXT,

    CONSTRAINT "shop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "access_token" (
    "id" UUID NOT NULL,
    "shop_id" INTEGER NOT NULL,
    "refresh_token" TEXT NOT NULL,
    "access_token" TEXT NOT NULL,
    "expire_in" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "access_token_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "access_token_shop_id_key" ON "access_token"("shop_id");

-- CreateIndex
CREATE UNIQUE INDEX "access_token_refresh_token_key" ON "access_token"("refresh_token");

-- AddForeignKey
ALTER TABLE "access_token" ADD CONSTRAINT "access_token_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shop"("id") ON DELETE CASCADE ON UPDATE CASCADE;
