import { NextFunction, Request, Response } from "express";
import { User } from "../models/User";
import { Appointment } from "../models/Appointment";
import { Service } from "../models/Service";
import { TokenData } from "../types";
import jwt from "jsonwebtoken";
import { isValidEmail, isValidPasswordFormat, isValidUserName, isValidUserSurname } from "../helpers/validation-utilities";

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

// validate token and token manipulation
// export const auth = async (req: Request, res: Response, next: NextFunction) => {
//     const { userId, roleName } = req.tokenData;
//     const user = await User.findOne({ where: { id: userId } });
//     if (!user || !user.isActive || roleName !== user.role.name) {
//         return res.status(401).json(
//             { 
//                 success: false,
//                 message: "Unauthorized"
//             }
//         );
//     }
        
//     req.user = user;
//     next();
// };

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        console.log("1. Token:", token);

        if (!token) {
            console.log("2. Token not found");
            return res.status(401).json(
                {
                    success: false,
                    message: "UNAUTHORIZED"
                }
            )
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        )

        console.log("3. Decoded token:", decoded);

        req.tokenData = decoded as TokenData;
        const { userId, roleName } = req.tokenData;
        const user = await User.findOne(
            {
                where: { id: userId } ,
                relations: {
                    role: true
                },
                select: {
                    id: true,
                    name: true,
                    surname: true,
                    email: true,
                    isActive: true,
                    role: {
                        id: true,
                        name: true
                    }
                }

            }
        );
        const { isActive, ...tokenUser } = user as User;
        console.log("4. User:", user);

        // verify if user exists and is active and role matches the token
        // TODO verify token in session database
        if (!user || !user.isActive || roleName !== user.role.name) {
            console.log("5. Unauthorized");
            return res.status(401).json(
                {
                    success: false,
                    message: "Unauthorized"
                }
            );
        }

        req.body.tokenUser = tokenUser;
        next();
    } catch (error) {
        console.log("6. Error:", error);
        return res.status(500).json(
            {
                success: false,
                message: "JWT NOT VALID OR MALFORMED",
                error: error
            }
        )
    }
}

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (req.tokenData.roleName !== "admin") {
        return res.status(401).json(
            {
                success: false,
                message: "Unauthorized"
            }
        );
    }
    next();
}

export const isSuperAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (req.tokenData.roleName !== "super_admin") {
        return res.status(401).json(
            {
                success: false,
                message: "Unauthorized"
            }
        );
    }
    next();
}


//user exists
export const targetUserExists = async (req: Request, res: Response, next: NextFunction) => {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
        return res.status(400).json(
            { 
                success: false,
                message: "Invalid user id"
            }
        );
    }
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
        return res.status(404).json(
            { 
                success: false,
                message: "No user exists with that id"
            }
        );
    }
    req.body.targetUser = user;
    next();
}

export const bodyUserExists = async (req: Request, res: Response, next: NextFunction) => {
    const userId = parseInt(req.body.id);
    if (isNaN(userId)) {
        return res.status(400).json(
            { 
                success: false,
                message: "Invalid user id"
            }
        );
    }
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
        return res.status(404).json(
            { 
                success: false,
                message: "No user exists with that id"
            }
        );
    }
    req.body.user = user;
    next();
}

//user is active TODO: Check if this is necessary or how to fix it.
export const userIsActive = (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.user.isActive && !req.body.targetUser.isActive) {
        return res.status(400).json(
            { 
                success: false,
                message: "User is not active"
            }
        );
    }
    next();
}


//user is admin

export const validateDate = (req: Request, res: Response, next: NextFunction) => {
    const date = new Date(req.body.date);

    if (isNaN(date.getTime())) {
        return res.status(400).json(
            { 
                success: false,
                message: "Invalid date"
            }
        );
    }
    if (date < new Date()) {
        return res.status(400).json(
            { 
                success: false,
                message: "Date is in the past"
            }
        );
    }
    next();
}

export const appointmentExists = async (req: Request, res: Response, next: NextFunction) => {
    const appointmentId = parseInt(req.params.id);
    if (isNaN(appointmentId)) {
        return res.status(400).json(
            { 
                success: false,
                message: "Invalid appointment id"
            }
        );
    }
    const appointment = await Appointment.findOne({ where: { id: appointmentId } });
    if (!appointment) {
        return res.status(404).json(
            { 
                success: false,
                message: "No appointment exists with that id"
            }
        );
    }
    next();
}

export const serviceExists = async (req: Request, res: Response, next: NextFunction) => {
    const serviceId = parseInt(req.body.serviceId);
    if (isNaN(serviceId)) {
        return res.status(400).json(
            { 
                success: false,
                message: "Invalid service id"
            }
        );
    }
    const service = await Service.findOne({ where: { id: serviceId } });
    if (!service) {
        return res.status(404).json(
            { 
                success: false,
                message: "No service exists with that id"
            }
        );
    }
    next();
}

export const validatePassword = (req: Request, res: Response, next: NextFunction) => {
    const { oldPassword, newPassword, newPasswordRepeat } = req.body;

    // Validate old passwords for password update
    if (oldPassword && !isValidPasswordFormat(oldPassword)) {
        return res.status(400).json({ success: false, message: "Old password must contain at least one uppercase letter, one lowercase letter, one number, and must be between 8 and 14 characters long" });
    }

    // Validate new password for password update
    if (newPassword && !isValidPasswordFormat(newPassword)) {
        return res.status(400).json({ success: false, message: "New password must contain at least one uppercase letter, one lowercase letter, one number, and must be between 8 and 14 characters long" });
    }

    // Validate confirmation password for password update
    if (newPasswordRepeat && !isValidPasswordFormat(newPasswordRepeat)) {
        return res.status(400).json({ success: false, message: "Confirmation password must contain at least one uppercase letter, one lowercase letter, one number, and must be between 8 and 14 characters long" });
    }

    next();
}

export const validateUserName = (req: Request, res: Response, next: NextFunction) => {
    const name = req.body.name;
    if (name) {
        if (!isValidUserName(name)){
            return res.status(400).json(
                { 
                    success: false, 
                    message: "Invalid name" 
                }
            );
        };
    }
    next();
};

export const validateUserSurname = (req: Request, res: Response, next: NextFunction) => {
    const surname = req.body.surname;
    if (surname) {
        if (!isValidUserSurname(surname)){
            return res.status(400).json(
                { 
                    success: false, 
                    message: "Invalid surname" 
                }
            );
        };
    }
    next();
};
    
export const validateEmail = (req: Request, res: Response, next: NextFunction) => {
    const email = req.body.email;
    if (email) {
        if (!isValidEmail(email)){
            return res.status(400).json(
                { 
                    success: false, 
                    message: "Invalid email format" 
                }
            );
        };
    }
    next();
};