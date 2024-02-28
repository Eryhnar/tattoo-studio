import { Request, Response } from "express";
import { User } from "../models/User";

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find(
            
            {
                select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                updatedAt: true,
                }
            }
              
        );

        return res.status(200).json(
            { 
                success: true,
                message: "Users retrieved successfully",
                data: users
            }
        );

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching users",
            error: error
        });
    }
};