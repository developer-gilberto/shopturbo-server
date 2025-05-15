import bcrypt from 'bcryptjs';

export async function hashPassword(password: string) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

export async function comparePassword(
    inputPassword: string,
    passwordStored: string
) {
    const macth = await bcrypt.compare(inputPassword, passwordStored);
    if (!macth) return false;
    return true;
}
