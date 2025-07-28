import z from "zod";

export function getAccessTokenSchema() {
    return z.object({
        code: z
            .string()
            .min(4, "'Code' must be at least 8 characters long!")
            .max(255, "'Code' must be at most 30 characters long!"),

        shop_id: z.string().min(1).max(255),
    });
}
