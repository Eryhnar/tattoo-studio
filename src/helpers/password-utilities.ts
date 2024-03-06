import bcrypt, { compare } from "bcrypt";

export const hashPassword = async (password: string) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (password: string, hash: string) => {
    return await compare(password, hash);
};