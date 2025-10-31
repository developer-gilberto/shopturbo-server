import { z } from 'zod';

const paramsSchema = z.object({
    shop_id: z.coerce.number().int().positive({
        message: 'shop_id deve ser um número positivo',
    }),
});

const productSchema = z.object({
    id: z.coerce.number().int().positive(),
    sku: z.string().min(1, 'SKU é obrigatório'),
    categoryId: z.coerce.number().int().positive(),
    name: z.string().min(1, 'Nome é obrigatório'),
    stock: z.coerce.number().int().nonnegative(),
    sellingPrice: z.coerce.number().nonnegative(),
    costPrice: z.coerce.number().nonnegative(),
    governmentTaxes: z.coerce.number().nonnegative(),
    imageUrl: z.string().url('URL da imagem inválida'),
});

const productsSchema = z
    .array(productSchema)
    .max(100, 'Você só pode enviar até 100 produtos por vez');

export const saveProductsSchema = z.object({
    params: paramsSchema,
    body: productsSchema,
});
