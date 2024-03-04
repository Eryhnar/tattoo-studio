import { Request, Response } from "express";
import { comparePassword, hashPassword } from "../helpers/password-utilities";
import { User } from "../models/User";
import { capitalizeFirstLetter } from "../helpers/validation-utilities";
import jwt from "jsonwebtoken";
import { Role } from "../models/Role";

//register
export const register = async (req: Request, res: Response) => {
    try {
        const { name, surname, email, password } = req.body;
        //let roleName = req.body.role;
        let roleName // maybe take it from body if there is a super admin token
        console.log(name, surname, email, password)
        
        const treatedName = capitalizeFirstLetter(name?.trim()); //should it capitalize the first letter of the name?
        console.log(treatedName)
        let treatedSurname: string | null = null;
        if (surname) {
            treatedSurname = capitalizeFirstLetter(surname?.trim()); //should it capitalize the first letter of the surname?
        }
        console.log(treatedSurname)
        if (!treatedName || !email || !password) {
            return res.status(400).json(
                { 
                    success: false,
                    message: "Please enter name, surname, email and password"
                }
            );
        }
        console.log("hi");
        const user = await User.findOneBy({ email: email });
        if (user) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }

        if(!roleName){ //remove this if statement if there is a super admin token
            roleName = "user";
        }
        const role = await Role.findOne({ where: { name: roleName } });

        if (!role) {
            return res.status(400).json(
                { 
                    success: false,
                    message: "Role does not exist"
                }
            );
        }
        console.log("hi2");
        const hashedPassword = await hashPassword(password);
        console.log(hashedPassword);
        const newUser = await User.create({
            name: treatedName,
            surname: treatedSurname || undefined,
            email: email,
            password: hashedPassword,
            role: role
        }).save();

        return res.status(201).json(
            { 
                success: true,
                message: `User ${newUser.name} created successfully`,
            }
        );

    } catch (error) {
        return res.status(500).json(
            { 
                success: false,
                message: "Error creating user",
                error: error
            }
        );
    }
}

//login
export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        console.log("1")
        if (!email || !password) {
            return res.status(400).json(
                { 
                    success: false,
                    message: "Please enter email and password"
                }
            );
        }
        console.log("2")
        const user = await User.findOne(
            {
                where: { email: email },
                relations: {
                    role: true
                },
                select: {
                    id: true,
                    name: true,
                    surname: true,
                    email: true,
                    password: true,
                    isActive: true,
                    role: {
                        id: true,
                        name: true
                    }
                }
            }
        );
        console.log("3")
        if (!user) {
            return res.status(404).json(
                { 
                    success: false,
                    message: "No user exists with that email" //should I be less specific?
                }
            );
        }
        console.log("4")
        if (!user.isActive) {
            return res.status(400).json(
                { 
                    success: false,
                    message: "User is inactive" //should I be less specific?
                }
            );
        }
        console.log("5")
        if (await comparePassword(password, user.password)) {
            //generate token
            console.log("5.5")
            console.log('JWT Secret:', process.env.JWT_SECRET);
            console.log('User ID:', user.id);
            console.log('User:', user.role);
            console.log('Role Name:', user.role.name);
            const token = jwt.sign(
                { userId: user.id,
                  roleName: user.role.name
                },
                process.env.JWT_SECRET as string,
                { 
                    expiresIn: "2h" 
                }
            );
            console.log("6")
            return res.status(200).json(
                { 
                    success: true,
                    message: "Login successful",
                    token: token
                }
            );
        }

    
    } catch (error) {
        return res.status(500).json(
            { 
                success: false,
                message: "Error logging in",
                error: error
            }
        );
    }
}
