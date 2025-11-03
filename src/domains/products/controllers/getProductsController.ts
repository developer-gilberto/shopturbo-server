import { Request, Response } from 'express';
import { getProductsSchema } from '../schemas/getProductsSchema';
import { ProductRepository } from '../repositories/productRepository';

export async function getProducts(req: Request, res: Response) {
    const safeData = getProductsSchema.safeParse({
        shopId: req.params.shop_id,
        offSet: req.query.offset,
        pageSize: req.query.page_size,
    });

    if (!safeData.success) {
        res.status(400).json({
            error: true,
            message: safeData.error.flatten().fieldErrors,
        });
        return;
    }

    const productRepo = new ProductRepository();

    try {
        const products = await productRepo.getProducts(
            safeData.data.offSet,
            safeData.data.pageSize,
            safeData.data.shopId,
        );

        if (products.error) {
            res.status(500).json({
                error: true,
                message:
                    'An error occurred while trying to retrieve products from the database.',
                data: null,
            });
            return;
        }

        res.status(200).json({
            error: false,
            data: products.data,
            pagination: products.pagination,
        });
    } catch (err) {
        console.error(
            `\x1b[1m\x1b[31m[ ERROR ] An error occurred while trying to retrieve products from the database.: \x1b[0m\n`,
            err,
        );
        res.status(500).json({
            error: true,
            message:
                'An error occurred while trying to retrieve products from the database.',
            data: null,
        });
    }
}
