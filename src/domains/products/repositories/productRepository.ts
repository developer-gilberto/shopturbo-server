import { prismaClient } from '../../../infra/db/dbConnection';
import { IExtendedProduct } from '../interfaces/productsInterfaces';
import { type Product as TProduct } from '@prisma/client';
import { IProductsPagination } from '../interfaces/productsInterfaces';

export class ProductRepository {
    async saveOrUpdate(
        productsData: IExtendedProduct[],
    ): Promise<{ error: boolean; data: TProduct[] | null }> {
        try {
            const result = await Promise.all(
                productsData.map((product) =>
                    prismaClient.product.upsert({
                        where: { id: product.id },
                        update: {
                            costPrice: product.costPrice,
                            governmentTaxes: product.governmentTaxes,
                        },
                        create: {
                            shopId: product.shopId,
                            id: product.id,
                            sku: product.sku,
                            categoryId: product.categoryId,
                            name: product.name,
                            stock: product.stock,
                            sellingPrice: product.sellingPrice,
                            costPrice: product.costPrice,
                            governmentTaxes: product.governmentTaxes,
                            imageUrl: product.imageUrl,
                        },
                    }),
                ),
            );

            return { error: false, data: result };
        } catch (err) {
            console.error(
                `\x1b[1m\x1b[31m[ ERROR ] An error occurred while trying to save the products to the database: \x1b[0m\n`,
                err,
            );
            return { error: true, data: null };
        }
    }

    async getProducts(
        offset: number,
        pagesize: number,
        shopId: number,
    ): Promise<{
        error: boolean;
        data: TProduct[] | null;
        pagination: IProductsPagination | null;
    }> {
        try {
            const [users, totalProducts] = await Promise.all([
                prismaClient.product.findMany({
                    skip: offset,
                    take: pagesize,
                    orderBy: { createdAt: 'desc' },
                    where: { shopId: shopId },
                }),

                prismaClient.product.count({ where: { shopId: shopId } }),
            ]);

            const nextOffset = offset + pagesize;
            const hasNextOffset = nextOffset < totalProducts;

            return {
                error: false,
                data: users,
                pagination: {
                    nextOffset: hasNextOffset ? nextOffset : null,
                    hasNextOffset,
                    totalProducts,
                },
            };
        } catch (err) {
            console.error(
                `\x1b[1m\x1b[31m[ ERROR ] An error occurred while trying to retrieve product data from getProducts(): \x1b[0m\n`,
                err,
            );
            return { error: true, data: null, pagination: null };
        }
    }
}
