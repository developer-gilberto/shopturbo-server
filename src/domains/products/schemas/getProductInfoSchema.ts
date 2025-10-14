import z from 'zod';

export function getProductInfoSchema() {
    return z.object({
        shopId: z.number().int().positive(),
        itemIdList: z
            .string()
            .transform((val) => val.split(',').map((id) => Number(id.trim())))
            .refine(
                (arr) => arr.every((id) => Number.isInteger(id) && id > 0),
                'Todos os item_id dos produtos devem ser números inteiros positivos.'
            )
            .refine(
                (arr) => arr.length > 0,
                'Você deve enviar pelo menos um item_id de um produto.'
            )
            .refine(
                (arr) => arr.length <= 50,
                'Você pode enviar no máximo 50 item_id.'
            ),
    });
}
