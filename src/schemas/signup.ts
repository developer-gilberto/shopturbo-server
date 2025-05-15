import { z } from 'zod';

export function signupSchema() {
    return z.object({
        name: z
            .string()
            .min(2, 'O nome deve ter pelo menos 2 caracteres!')
            .max(30, 'O nome deve ter no máximo 30 caracteres!'),

        email: z
            .string()
            .email('E-mail com formato inválido!')
            .min(2, 'O email deve ter pelo menos 8 caracteres!')
            .max(30, 'O email deve ter no máximo 30 caracteres!'),

        password: z
            .string()
            .min(4, 'A senha deve ter no mínimo 4 caracteres!')
            .max(255, 'A senha deve ter no máximo 255 caracteres!'),

        termsOfUse: z
            .string()
            .min(
                2,
                'É necessário aceitar os termos de uso para criar uma conta!'
            )
            .max(2, ' "termsOfUse" deve ter no máximo 2 caracteres. "on" '),
    });
}
