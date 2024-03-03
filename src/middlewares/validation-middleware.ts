import { NextFunction, Request, Response } from "express";
import { User } from "../models/User";

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
};

export const userExists = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.tokenData.userId;
    const user = await User.findOne({ where: { id: id } });
    if (!user) {
        return res.status(404).json(
            { 
                success: false,
                message: "No user exists with that id"
            }
        );
    }
    req.user = user;
    next();
};