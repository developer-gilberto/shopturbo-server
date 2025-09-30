import z from "zod";

export function getAccessTokenSchema() {
    return z.object({
        code: z
            .string({
                required_error: "'code' é obrigatório",
                invalid_type_error: "'code' deve ser uma string",
            })
            .nonempty("'code' não pode ser vazio")
            .min(8, "'code' deve ter no mínimo 8 caracteres")
            .max(255, "'code' deve ter no máximo 255 caracteres"),

        shop_id: z
            .string({
                required_error: "'shop_id' é obrigatório",
                invalid_type_error: "'shop_id' deve ser uma string",
            })
            .nonempty("'shop_id' não pode ser vazio")
            .max(255, "'shop_id' deve ter no máximo 255 caracteres"),
    });
}
