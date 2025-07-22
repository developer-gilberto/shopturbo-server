import bcrypt from "bcryptjs";

export async function hashPassword(password: string) {
    try {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    } catch (err) {
        console.error(
            "\x1b[1m\x1b[31m[ ERROR ] Error generating password hash: \x1b[0m\n",
            err,
        );
        return null;
    }
}

export async function comparePassword(
    inputPassword: string,
    passwordStored: string,
): Promise<{ error: boolean; match: boolean | null }> {
    try {
        const result = await bcrypt.compare(inputPassword, passwordStored);
        return { error: false, match: result };
    } catch (err) {
        console.error(
            "\x1b[1m\x1b[31m[ ERROR ] An error occurred while trying to compare the password hash: \x1b[0m\n",
            err,
        );
        return { error: true, match: null };
    }
}
