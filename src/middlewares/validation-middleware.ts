import { NextFunction, Request, Response } from "express";

export const validateId = (req: Request, res: Response, next: NextFunction) => {
    const id = req.tokenData.userId;
    if (typeof id !== "number") {
        return res.status(400).json(
            { 
                success: false,
                message: "Invalid id"
            }
        );
    }
    next();
}

export const userExists = async (id: any)