import { User } from "../models/User";

export type TokenData = {
    userId: number;
    roleName: string;
    name: string;
};

declare global {
    namespace Express {
        export interface Request {
            tokenData: TokenData;
            user?: User; //check if this is fine.
        }
    }
}