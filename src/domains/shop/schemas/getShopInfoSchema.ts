import z from 'zod';

export function getShopInfoSchema() {
    return z.object({
        shopId: z.number().int().positive(),
    });
}
