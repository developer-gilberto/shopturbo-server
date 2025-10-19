import z from 'zod';

export function ordersDetailsSchema() {
    return z.object({
        shopId: z.number().int().positive(),
        orderIdList: z
            .union([
                z.string().min(1, 'O order_id não pode ser vazio.'),
                z
                    .array(
                        z
                            .string()
                            .min(
                                1,
                                'Os order_id_list não podem conter strings vazias.'
                            )
                    )
                    .min(1, 'Você deve enviar pelo menos um order_id_list.'),
            ])
            .refine(
                (val) => (Array.isArray(val) ? val.length <= 50 : true),
                'Você pode enviar no máximo 50 order_id_list.'
            ),
    });
}
