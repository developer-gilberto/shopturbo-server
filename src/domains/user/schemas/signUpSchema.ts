import { z } from "zod";

export function signUpSchema() {
    return z.object({
        name: z
            .string()
            .min(2, "Name must be at least 2 characters long!")
            .max(30, "Name must be at most 30 characters long!"),

        email: z
            .string()
            .email("Email is not valid!")
            .min(8, "Email must be at least 8 characters long!")
            .max(30, "Email must be at most 30 characters long!"),

        password: z
            .string()
            .min(4, "Password must be at least 4 characters long!")
            .max(255, "Password must be at most 255 characters long!"),

        termsOfUse: z
            .string()
            .length(2, "termsOfUse must be a string equal to: 'on' "),
    });
}
