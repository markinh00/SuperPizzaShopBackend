import bcrypt from "bcrypt";

const SALT_ROUNDS = process.env.SALT_ROUNDS || 10

export async function getHashedPassword(password: string) {
    return await bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, candidatePassword: string) {
    await bcrypt.compare(password, candidatePassword);
}