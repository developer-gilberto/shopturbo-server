import z from 'zod';

export function signinSchema() {
    return z.object({
        email: z
            .string()
            .email('E-mail com formato inválido!')
            .min(2, 'O email deve ter pelo menos 8 caracteres!')
            .max(30, 'O email deve ter no máximo 30 caracteres!'),

        password: z
            .string()
            .min(4, 'A senha deve ter no mínimo 4 caracteres!')
            .max(255, 'A senha deve ter no máximo 255 caracteres!'),
    });
}
