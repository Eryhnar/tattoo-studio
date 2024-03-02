import { Request, Response } from "express";
import { comparePassword, hashPassword } from "../helpers/password-utilities";
import { User } from "../models/User";
import { validateEmail, validatePassword, validateUserName } from "../helpers/validation-utilities";
import jwt from "jsonwebtoken";

//register
export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;
        
        const treatedName = name?.trim(); //should it capitalize the first letter of the name?
        if (treatedName) { //can be avoided if I force the user to not enter a name during registration OR force them to enter a name in the db and model


            if (!validateUserName(treatedName)) {
                return res.status(400).json(
                    { 
                        success: false,
                        message: "Invalid user name. Only unicode characters are allowed and it must not exceed 50 characters"
                    }
                );
            };
        }

        // validate email    JOIN email and password validation
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
                name: treatedName,  
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

        if (!email || !password) {
            return res.status(400).json(
                { 
                    success: false,
                    message: "Please enter email and password"
                }
            );
        }

        if (!validateEmail(email) || !validatePassword(password)) {
            return res.status(400).json(
                { 
                    success: false,
                    message: "Invalid email or password" //message might not be accurate since it checks format and not values
                }
            );
        }

        const user = await User.findOne(
            {
                where: { email: email }
            }
        );

        if (!user) {
            return res.status(404).json(
                { 
                    success: false,
                    message: "No user exists with that email" //should I be less specific?
                }
            );
        }

        if (!user.isActive) {
            return res.status(400).json(
                { 
                    success: false,
                    message: "User is inactive" //should I be less specific?
                }
            );
        }

        if (await comparePassword(password, user.password)) {
            //generate token
            const token = jwt.sign(
                { userId: user.id,
                  roleName: user.role.name
                },
                process.env.JWT_SECRET as string,
                { 
                    expiresIn: "2h" 
                }
            );

            return res.status(200).json(
                { 
                    success: true,
                    message: "Login successful",
                    token: token  //CAREFUL WITH SENDING IT LIKE THIS
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
