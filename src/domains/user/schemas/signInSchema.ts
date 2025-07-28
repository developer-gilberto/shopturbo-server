import z from "zod";

export function signInSchema() {
    return z.object({
        email: z
            .string()
            .email("Invalid email format!")
            .min(8, "Email must be at least 8 characters long!")
            .max(50, "Email must be at most 30 characters long!"),

        password: z
            .string()
            .min(4, "Password must be at least 4 characters long!")
            .max(255, "Password must be at most 255 characters long!"),
    });
}
