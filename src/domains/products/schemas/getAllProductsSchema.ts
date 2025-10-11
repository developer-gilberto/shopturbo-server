import z from 'zod';

export function getAllProductsSchema() {
    return z.object({
        shopId: z.number().int().positive(),
        offset: z.number().int().min(0),
        pageSize: z.number().int().min(1).max(100),
        itemStatus: z.enum([
            'NORMAL',
            'BANNED',
            'UNLIST',
            'REVIEWING',
            'SELLER_DELETE',
            'SHOPEE_DELETE',
        ]),
    });
}
