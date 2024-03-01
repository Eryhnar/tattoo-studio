import { Request, Response } from "express";
import { User } from "../models/User";
import { validateEmail, validatePassword, validateUserName } from "../helpers/validation-utilities";
import { comparePassword } from "../helpers/password-utilities";
import { FindOperator } from "typeorm/find-options/FindOperator";
import { Like } from "typeorm";

export const getUsers = async (req: Request, res: Response) => {
    try {
        interface queryFiltersI {
            name?: FindOperator<string>,
            email?: FindOperator<string>
        }

        const queryFilters: queryFiltersI = {}

        if (req.query.name) {
            queryFilters.name = Like("%"+req.query.name+"%");
        }

        if (req.query.email) {
            queryFilters.email = Like("%"+req.query.email.toString()+"%");
        }

        const users = await User.find(
            
            {
                where: queryFilters,
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

export const getProfile = async (req: Request, res: Response) => {
    try {
        const userId = req.tokenData.userId;
        const user = await User.findOne({ where:{id: userId} });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.status(200).json({ success: true, message: "User retrieved successfully", data: user });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Error fetching user", error: error });
    }
}

export const updateProfile = async (req: Request, res: Response) => { //update multiple fields. Should I update one field at a time? // ask for login before updating??
    try {
        const userId = req.tokenData.userId;
        let { name, email } = req.body;

        if (!await User.findOne({ where: {id: userId} })) { //redundant
            return res.status(404).json({ success: false, message: "User not found" });
        }

        let updateFields: { [key: string]: string } = {};

        if (name) {
            name = name.trim();
            updateFields["name"] = name;
        }

        if (email) {
            email = email.trim();
            updateFields["email"] = email;
        }

        if (updateFields["name"] && !validateUserName(updateFields["name"])) {
            return res.status(400).json({ success: false, message: "Invalid user name. Only unicode characters are allowed and it must not exceed 50 characters" });
        }

        if (updateFields["email"] && !validateEmail(updateFields["email"])) {
            return res.status(400).json({ success: false, message: "Invalid email" });
        }

        await User.update({ id: userId }, updateFields);

        return res.status(200).json({ success: true, message: "User updated successfully" });

    } catch (error) {

        return res.status(500).json({ success: false, message: "Error updating user", error: error });

    }
};

export const updateUserById = async (req: Request, res: Response) => { //update multiple fields. Should I update one field at a time? // ask for login before updating??
    try {
        const targetUserId = parseInt(req.params.id);
        let { name, email } = req.body;

        const targetUser = await User.findOneBy({ id: targetUserId });
        if (!targetUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        let updateFields: { [key: string]: string } = {};

        if (name) {
            name = name.trim();
            updateFields["name"] = name;
        }

        if (email) {
            email = email.trim();
            updateFields["email"] = email;
        }

        if (updateFields["name"] && !validateUserName(updateFields["name"])) {
            return res.status(400).json({ success: false, message: "Invalid user name. Only unicode characters are allowed and it must not exceed 50 characters" });
        }

        if (updateFields["email"] && !validateEmail(updateFields["email"])) {
            return res.status(400).json({ success: false, message: "Invalid email" });
        }

        await User.update({ id: targetUserId }, updateFields);

        return res.status(200).json({ success: true, message: "User updated successfully" });

    } catch (error) {

        return res.status(500).json({ success: false, message: "Error updating user", error: error });

    }
};


//// REHACER
export const updateProfilePassword = async (req: Request, res: Response) => {
    try {
        
        const targetUserId = parseInt(req.params.id);
        const { oldPassword, newPassword, newPasswordRepeat } = req.body;

        const targetUser = await User.findOneBy({ id: targetUserId });
        if (!targetUser) {
            return res.status(404).json(
                { 
                    success: false, 
                    message: "User not found" 
                }
            );
        }
        if (newPassword !== newPasswordRepeat) {
            return res.status(400).json(
                { 
                    success: false, 
                    message: "Passwords do not match" 
                }
            );
        }
        if (!validatePassword(newPassword)) {
            return res.status(400).json(
                { 
                    success: false, 
                    message: "Invalid password" 
                }
            );
        };
        if (!await comparePassword(oldPassword, targetUser.password)) {
            return res.status(400).json(
                { 
                    success: false, 
                    message: "Invalid old password" 
                }
            );
        }
        User.update({ id: targetUserId }, { password: newPassword });
        return res.status(200).json(
            { 
                success: true, 
                message: "User password updated successfully" 
            }
        );

    } catch (error) {
        return res.status(500).json(
            { 
                success: false, 
                message: "Error updating user password", 
                error: error 
            }
        );
    }
};

export const deleteUserById = async (req: Request, res: Response) => {
    try {
        
        const targetUserId = parseInt(req.params.id);
        const targetUser = await User.findOneBy({ id: targetUserId });

        if (!targetUser) {
            return res.status(404).json(
                { 
                    success: false, 
                    message: "User not found" 
                }
            );
        }

        await User.delete({ id: targetUserId });
        return res.status(200).json( //200 or 204?
            { 
                success: true, 
                message: "User deleted successfully" 
            }
        );

    } catch (error) {

        return res.status(500).json(
            { 
                success: false, 
                message: "Error deleting user", 
                error: error 
            }
        );

    }
};
    