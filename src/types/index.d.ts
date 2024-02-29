export type TokenData = {
    userId: number;
    roleName: string;
};

declare global {
    namespace Express {
        export interface Request {
            tokenData: TokenData;
        }
    }
}