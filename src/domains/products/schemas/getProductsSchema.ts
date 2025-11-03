import { z } from 'zod';

export const getProductsSchema = z.object({
    shopId: z.coerce.number().int().positive({
        message: 'shop_id deve ser um número positivo',
    }),
    offSet: z.coerce.number().int().min(0),
    pageSize: z.coerce.number().int().min(1).max(100),
});
