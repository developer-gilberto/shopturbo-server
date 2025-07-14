import z from "zod";

export function getAccessTokenSchema() {
    return z.object({
        code: z
            .string()
            .min(4, "'Code' must be at least 8 characters long!")
            .max(255, "'Code' must be at most 30 characters long!"),

        shop_id: z
            .string()
            .min(1, "'shop_id' must be at least 4 characters long!")
            .max(255, "'shop_id' must be at most 255 characters long!"),
    });
}
