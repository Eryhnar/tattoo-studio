import { NextFunction, Request, Response } from "express";
import { User } from "../models/User";
import { Appointment } from "../models/Appointment";

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
    if (typeof appointmentId !== "number") {
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
    if (typeof serviceId !== "number") {
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
    