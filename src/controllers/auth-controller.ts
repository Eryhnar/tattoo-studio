import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../models/User";

//MOVE TO HELPERS
const nameMaxLength = 50;
const validateUserName = (name: string) => {
    if(name == null || name.length > nameMaxLength || /[^ \p{L}]/gu.test(name)){ // consider spaces validation if surname is added
        return false;
    }
    return true;
};

const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // considering adding a domain validation
    if(email == null || email.length > 100 || !emailRegex.test(email)){
        return false;
    }
    return true;
};

const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,14}$/;
    if(password == null || password.length < 8 || password.length > 14 || !passwordRegex.test(password)){
        return false;
    }
    return true;
};

const hashPassword = async (password: string) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};


export const register = async (req: Request, res: Response) => {
    try {
        let { name, email, password } = req.body;
        
        if (name) { //can be avoided if I force the user to not enter a name during registration OR force them to enter a name in the db and model
            name = name.trim(); //should it capitalize the first letter of the name?
            // validate token??
            if (!validateUserName(name)) {
                return res.status(400).json(
                    { 
                        success: false,
                        message: "Invalid user name. Only unicode characters are allowed and it must not exceed 50 characters"
                    }
                );
            };
        }

        // validate email
        if (!validateEmail(email)) {
            return res.status(400).json(
                { 
                    success: false,
                    message: "Invalid email"
                }
            );
        }

        // validate password
        if (!validatePassword(password)) {
            return res.status(400).json(
                { 
                    success: false,
                    message: "The password must contain at least one uppercase letter, one lowercase letter, one number, and must be between 8 and 14 characters long"
                }
            );
        }

        const hashedPassword = await hashPassword(password);

        const user = await User.findOneBy({  email: email }); 
        if (user) {
            return res.status(400).json(
                { 
                    success: false,
                    message: "User already exists"
                }
            );
        }

        const newUser = await User.create(
            {
                name: name,  
                email: email,
                password: hashedPassword
            }
        ).save();

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
                message: "Error creating role",
                error: error
            }
        );
    }
}

