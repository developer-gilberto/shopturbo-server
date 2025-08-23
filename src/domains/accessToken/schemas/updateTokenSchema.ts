import z from "zod";

export function updateAccessTokenSchema() {
    return z.object({
        shopId: z.string().min(1).max(255),

        refreshToken: z.string().min(1).max(255),
    });
}
