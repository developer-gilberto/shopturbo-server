import z from 'zod';

export function getProductSchema() {
    return z.object({
        shopId: z.number().int().positive(),
        itemId: z.number().int().positive(),
    });
}
