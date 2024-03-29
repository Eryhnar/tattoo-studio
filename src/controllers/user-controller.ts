import { Request, Response } from "express";
import { User } from "../models/User";
import { comparePassword } from "../helpers/password-utilities";
import { FindOperator } from "typeorm/find-options/FindOperator";
import { Like } from "typeorm";
import bcrypt from "bcrypt";
import { capitalizeFirstLetter } from "../helpers/validation-utilities";

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
        const user = req.body.tokenUser;

        if (!user) {
            return res.status(404).json(
                { 
                    success: false, 
                    message: "User not found" 
                }
            );
        }

        return res.status(200).json(
            { 
                success: true, 
                message: "User retrieved successfully", 
                data: user 
            }
        );

    } catch (error) {
        return res.status(500).json(
            { 
                success: false, 
                message: "Error fetching user", 
                error: error 
            }
        );
    }
}

export const updateProfile = async (req: Request, res: Response) => { //update multiple fields. Should I update one field at a time? // ask for login before updating??
    try {
        const userId = req.tokenData.userId;
        let { name, surname, email } = req.body;
        interface updateFieldsI {
            name?: string,
            surname?: string,
            email?: string
        }


        // if (!await User.findOne({ where: {id: userId} })) { //redundant
        //     return res.status(404).json({ success: false, message: "User not found" });
        // }

        const updateFields: updateFieldsI = {};

        if (name) {
            name = capitalizeFirstLetter(name.trim());
            updateFields.name = name;
        }
        
        if (surname) {
            surname = capitalizeFirstLetter(surname.trim());
            updateFields.surname = surname;
        }

        if (email) {
            email = email.trim();
            updateFields.email = email;
        }

        // if (updateFields["name"] && !validateUserName(updateFields["name"])) {
        //     return res.status(400).json({ success: false, message: "Invalid user name. Only unicode characters are allowed and it must not exceed 50 characters" });
        // }

        // if (updateFields["email"] && !validateEmail(updateFields["email"])) {
        //     return res.status(400).json({ success: false, message: "Invalid email" });
        // }

        await User.update({ id: userId }, updateFields);

        return res.status(200).json({ success: true, message: "User updated successfully" });

    } catch (error) {

        return res.status(500).json({ success: false, message: "Error updating user", error: error });

    }
};

export const updateProfilePassword = async (req: Request, res: Response) => {
    try {
        console.log(1);
        
        //const targetUserId = parseInt(req.params.id);
        const { oldPassword, newPassword, newPasswordRepeat } = req.body;
        const user = (await User.findOne(
            { 
                where: {id: req.tokenData.userId},
                select: {
                    id: true,
                    name: true,
                    surname: true,
                    email: true,
                    password: true,
                    isActive: true,
                }
            }
            
        ))!;
        console.log(oldPassword, newPassword, newPasswordRepeat, user.password)
        console.log(user)

        // const targetUser = await User.findOneBy({ id: targetUserId });
        // if (!targetUser) {
        //     return res.status(404).json(
        //         { 
        //             success: false, 
        //             message: "User not found" 
        //         }
        //     );
        // }
        if (newPassword !== newPasswordRepeat) {
            console.log(2);
            return res.status(400).json(
                { 
                    success: false, 
                    message: "Passwords do not match" 
                }
            );
        }
        // if (!validatePassword(newPassword)) {
        //     return res.status(400).json(
        //         { 
        //             success: false, 
        //             message: "Invalid password" 
        //         }
        //     );
        // };

        if (!await comparePassword(oldPassword, user.password)) {
            console.log(3);
            return res.status(400).json(
                { 
                    success: false, 
                    message: "Invalid old password" 
                }
            );
        }
        console.log(4);
        const newHash = await bcrypt.hash(newPassword, 10);
        User.update({ id: user.id }, { password: newHash });
        return res.status(200).json(
            { 
                success: true, 
                message: "User password updated successfully" 
            }
        );

    } catch (error) {
        console.log(5);
        return res.status(500).json(
            { 
                success: false, 
                message: "Error updating user password", 
                error: error 
            }
        );
    }
};

export const deactivateUser = async (req: Request, res: Response) => {
    try {
        const password = req.body.password;
        const targetUserId = req.tokenData.userId;
        const targetUser = await User.findOne(
            { 
                where: {id: targetUserId},
                select: {
                    id: true,
                    name: true,
                    surname: true,
                    email: true,
                    password: true,
                    isActive: true,
                }
            });

        if (!targetUser) { //should not trigger and be redundant
            return res.status(404).json(
                { 
                    success: false, 
                    message: "User not found" 
                }
            );
        }

        // if (!validatePassword(password)) { //join with next if?
        //     return res.status(400).json(
        //         { 
        //             success: false, 
        //             message: "Invalid credentials" 
        //         }
        //     );
        // }

        if (!await comparePassword(password, targetUser.password)) {
            return res.status(400).json(
                { 
                    success: false, 
                    message: "Invalid credentials" 
                }
            );
        }

        await User.update({ id: targetUserId }, { isActive: false });

        return res.status(200).json(
            { 
                success: true, 
                message: "User deactivated successfully" 
            }
        );

    } catch (error) {
        return res.status(500).json(
            { 
                success: false, 
                message: "Error deactivating user", 
                error: error 
            }
        );
    }
}

export const updateUserById = async (req: Request, res: Response) => { //update multiple fields. Should I update one field at a time? // ask for login before updating??
    try {
        const targetUserId = parseInt(req.params.id);
        let { name, surname, email } = req.body; // change to const
        interface updateFieldsI {
            name?: string,
            surname?: string,
            email?: string
        }

        const targetUser = await User.findOneBy({ id: targetUserId });
        if (!targetUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // TODO implement interface for updateFields
        let updateFields: updateFieldsI = {}; 

        //TODO redo this whole section
        if (name) {
            name = capitalizeFirstLetter(name.trim());
            updateFields.name = name;
        }

        if (surname) {
            surname = capitalizeFirstLetter(surname.trim());
            updateFields.surname = surname;
        }

        if (email) {
            email = email.trim();
            updateFields.email = email;
        }

        // if (updateFields["name"] && !validateUserName(updateFields["name"])) {
        //     return res.status(400).json({ success: false, message: "Invalid user name. Only unicode characters are allowed and it must not exceed 50 characters" });
        // }

        // if (updateFields["email"] && !validateEmail(updateFields["email"])) {
        //     return res.status(400).json({ success: false, message: "Invalid email" });
        // }
        // -----------------------------------------
        await User.update({ id: targetUserId }, updateFields);

        return res.status(200).json({ success: true, message: "User updated successfully" });

    } catch (error) {

        return res.status(500).json({ success: false, message: "Error updating user", error: error });

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

export const getArtists = async (req: Request, res: Response) => {
    try {
        const artists = await User.find(
            {
                where: { role: 
                    {
                        id: 3
                    } 
                },
                select: {
                    id: true,
                    name: true,
                    surname: true,
                    email: true,
                    createdAt: true,
                    updatedAt: true,
                }
            }
        );

        return res.status(200).json(
            { 
                success: true, 
                message: "Artists retrieved successfully", 
                data: artists 
            }
        );

    } catch (error) {
        return res.status(500).json(
            { 
                success: false, 
                message: "Error fetching artists", 
                error: error 
            }
        );
    }
}
    