import { Request, Response } from "express";
import { Role } from "../models/Role";

export const getRoles = async (req: Request, res: Response) => {
    try {

        // validate SUPER ADMIN credentials before getting roles

        const roles = await Role.find();
        return res.json(roles);
    } catch (error) {
        return res.status(500).json(
            { 
                success: false,
                message: "Error retrieving roles",
                error: error
            }
        );
    }
}

export const createRole = async (req: Request, res: Response) => {
    try {
        let { name } = req.body;

        // validate token??

        name = name.trim().toLowerCase();
        //if(name == null || name.length > 50 || name.includes(" ") || /[!@#$%^&*(),.?":{}|<>[\]]/.test(name) || /[0-9]/.test(name)){
        if(name == null || name.length > 50 || name.includes(" ") || /[^ \p{L}]/gu.test(name)){
            return res.status(400).json(
                { 
                    success: false,
                    message: "Invalid role name. Only unicode characters are allowed and it must not exceed 50 characters"
                }
            );
        }
        const roles = await Role.find({ where: { name: name } });
        if (roles.length == 0) {
            const newRole = await Role.create({ name: name }).save();
            return res.status(201).json(
                { 
                    success: true,
                    message: `Role ${newRole} created successfully`,
                    data: newRole
                }
            );
        }
    } catch (error) {
        return res.status(500).json(
            { 
                success: false,
                message: "Error creating role",
                error: error
            }
        );
    }
}

export const updateRole = async (req: Request, res: Response) => {
    try {
        // validate token before updating role

        const { targetRole, name } = req.body;
        const trimmedName = name.trim().toLowerCase();

        if (trimmedName == null || trimmedName.length > 50 || trimmedName.includes(" ") || /[^ \p{L}]/gu.test(trimmedName)) {
            return res.status(400).json({
                success: false,
                message: "Invalid role name. Only unicode characters are allowed and it must not exceed 50 characters"
            });
        }

        const existingRole = await Role.findOne({ where: { name: targetRole } });
        if (!existingRole) {
            return res.status(404).json({
                success: false,
                message: "Role not found"
            });
        }
        
        if (existingRole.name === trimmedName) {
            return res.status(400).json({
                success: false,
                message: "Role name matches current name"
            });
        }
        
        const roleWithNewNameExists = await Role.findOne({ where: { name: trimmedName } });
        if (roleWithNewNameExists) {
            return res.status(400).json({
                success: false,
                message: "Another role with this name already exists"
            });
        }
        
        existingRole.name = trimmedName;
        await existingRole.save();
        
        return res.json({
            success: true,
            message: "Role updated successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error updating role",
            error: error
        });
    }
}
