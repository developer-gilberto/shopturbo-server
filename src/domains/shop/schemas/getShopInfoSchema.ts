import z from "zod";

export function getShopInfoSchema() {
    return z.object({
        accessToken: z.string().min(1).max(255),

        shopId: z.number().int().positive(),
    });
}
