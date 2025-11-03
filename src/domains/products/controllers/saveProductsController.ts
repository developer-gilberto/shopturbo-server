import { Request, Response } from 'express';
import { saveProductsSchema } from '../schemas/saveProductsSchema';
import { ProductRepository } from '../repositories/productRepository';
import { IProduct } from '../interfaces/productsInterfaces';

export async function saveProducts(req: Request, res: Response) {
    const safeData = saveProductsSchema.safeParse({
        params: req.params,
        body: req.body,
    });

    if (!safeData.success) {
        const errors = safeData.error.errors.map((err) => ({
            path: err.path.join('.'),
            message: err.message,
        }));

        res.status(400).json({
            error: true,
            message: 'Bad Request',
            errors,
        });
        return;
    }

    const shopId = Number(safeData.data.params.shop_id);
    const products: IProduct[] = safeData.data.body;

    const productsAndShopId = products.map((product) => ({
        ...product,
        shopId,
    }));

    const productRepo = new ProductRepository();

    try {
        const result = await productRepo.saveOrUpdate(productsAndShopId);

        if (result.error) {
            res.status(500).json({
                error: true,
                message:
                    'An error occurred while trying to save the products to the database.',
                data: null,
            });
            return;
        }

        res.status(201).json({
            error: false,
            message: 'Products successfully saved to the database.',
            data: result.data,
        });
    } catch (err) {
        console.error(
            `\x1b[1m\x1b[31m[ ERROR ] An error occurred while trying to save the products to the database: \x1b[0m\n`,
            err,
        );
        res.status(500).json({
            error: true,
            message:
                'An error occurred while trying to save the products to the database.',
            data: null,
        });
    }
}
