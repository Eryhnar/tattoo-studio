import { Request, Response } from "express";
import { Appointment, AppointmentStatus } from "../models/Appointment";
import { User } from "../models/User";
import { Service } from "../models/Service";
import { FindOperator, Like } from "typeorm";
import { isValidDate, validateId } from "../helpers/validation-utilities";
//import Reference from 'typeorm';

export const createAppointment = async (req: Request, res: Response) => {
    try {
        const { serviceId, artistId, date, time } = req.body;
        const customerId = req.tokenData.userId;

        if (!serviceId || !date || !time) {
            return res.status(400).json(
                { 
                    success: false, 
                    message: "Please enter serviceId, date and time" 
                }
            );
        }

        const customer = await User.findOne({ where: { id: customerId } });
        if (!customer) {
            return res.status(404).json(
                { 
                    success: false, 
                    message: "User not found" 
                }
            );
        }

        const artist = await User.findOne({ where: { id: artistId } });
        if (!artist) {
            return res.status(404).json(
                { 
                    success: false, 
                    message: "Artist not found" 
                }
            );
        }

        const service = await Service.findOne({ where: { id: serviceId } });
        if (!service) {
            return res.status(404).json(
                { 
                    success: false, 
                    message: "Service not found" 
                }
            );
        }

        //validate date. It should be in the future
        const appointmentDate = new Date(date);
        if (appointmentDate < new Date()) {
            return res.status(400).json(
                { 
                    success: false, 
                    message: "Invalid date" 
                }
            );
        }

        //validate neither the artist nor the customer have an appointment at the same time
        const artistAppointments = await Appointment.find({ where: { artist: artist, date: date } });
        if (artistAppointments.length > 0) {
            return res.status(400).json(
                { 
                    success: false, 
                    message: "Artist is not available at that time" 
                }
            );
        }
        const customerAppointments = await Appointment.find({ where: { customer: customer, date: date } });
        if (customerAppointments.length > 0) {
            return res.status(400).json(
                { 
                    success: false, 
                    message: "You already have an appointment at that time" 
                }
            );
        }

        // TODO calculate duration 

        const newAppointment = await Appointment.create(
            {
                customer: customer,
                artist: artist,
                service: service,
                date: date,
            }
        ).save();

        res.status(201).json(
            { 
                success: true, 
                message: "Appointment created successfully",
                data: newAppointment
            }
        );
    } catch (error) {
        res.status(500).json(
            { 
                success: false, 
                message: "Error creating appointment", 
                error: error 
            }
        );
    }
}

export const updateAppointment = async (req: Request, res: Response) => {
    try {
        //get the variables from the request
        const appointmentId = parseInt(req.params.id);
        const customerId = req.tokenData.userId;
        const { date, artist, service } = req.body;

        interface AppointmentFiltersI {
            date?: Date;
            artist?: User;
            service?: Service;
            //duration: number;
        }
        const appointmentFilters: AppointmentFiltersI = {};

        //validate customer exists
        const customer = await User.findOne({ where: { id: customerId } });
        if (!customer) {
            return res.status(404).json(
                { 
                    success: false, 
                    message: "User not found" 
                }
            );
        }

        //get the appointment from the database
        const appointment = await Appointment.findOne({ where: { id: appointmentId } });
        if (!appointment) {
            return res.status(404).json(
                { 
                    success: false, 
                    message: "Appointment not found" 
                }
            );
        }

        //validate the service exists
        const newService = await Service.findOne({ where: { id: service } });
        if (!newService) {
            return res.status(404).json(
                { 
                    success: false, 
                    message: "Service not found" 
                }
            );
        }
        appointmentFilters.service = newService;

        //validate the artist exists
        const newArtist = await User.findOne({ where: { id: artist } });
        if (!newArtist) {
            return res.status(404).json(
                { 
                    success: false, 
                    message: "Artist not found" 
                }
            );
        }
        appointmentFilters.artist = newArtist;

        //validate the date is in the future
        const appointmentDate = new Date(date);
        if (appointmentDate < new Date()) {
            return res.status(400).json(
                { 
                    success: false, 
                    message: "Invalid date" 
                }
            );
        }

        //validate the customer is available
        const customerAppointments = await Appointment.find({ where: { customer: customer, date: date } });
        if (customerAppointments.length > 0) {
            return res.status(400).json(
                { 
                    success: false, 
                    message: "You already have an appointment at that time" 
                }
            );
        }

        //validate the artist is available
        const artistAppointments = await Appointment.find({ where: { artist: newArtist, date: date } });
        if (artistAppointments.length > 0) {
            return res.status(400).json(
                { 
                    success: false, 
                    message: "Artist is not available at that time" 
                }
            );
        }
        appointmentFilters.date = appointmentDate;

        //TODO calculate duration
        // appointmentFilters.duration = newDuration;

        //update the appointment
        await Appointment.update({ id: appointmentId }, appointmentFilters);

        res.status(200).json(
            { 
                success: true, 
                message: "Appointment updated successfully",
                data: appointment
            }
        );
    } catch (error) {
        res.status(500).json(
            { 
                success: false, 
                message: "Error updating appointment", 
                error: error 
            }
        );
    }
}

export const cancelAppointment = async (req: Request, res: Response) => {
    try {
        const appointmentId = parseInt(req.params.id);
        const customerId = req.tokenData.userId;

        const customer = await User.findOne({ where: { id: customerId, isActive: true } });
        if (!customer) {
            return res.status(404).json(
                { 
                    success: false, 
                    message: "User not found" 
                }
            );
        }

        const appointment = await Appointment.findOne({ where: { id: appointmentId, customer: customer } });
        if (!appointment || appointment.status !== "pending") {
            return res.status(404).json(
                { 
                    success: false, 
                    message: "Appointment not found" 
                }
            );
        }

        await Appointment.update({ id: appointmentId }, { status: AppointmentStatus.cancelled });

        res.status(200).json(
            { 
                success: true, 
                message: "Appointment cancelled successfully"
            }
        );
    } catch (error) {
        res.status(500).json(
            { 
                success: false, 
                message: "Error cancelling appointment", 
                error: error 
            }
        );
    }
}

export const deleteAppointment = async (req: Request, res: Response) => {
    try {
        const userId = req.tokenData.userId;
        const appointmentId = parseInt(req.params.id);

        const user = await User.findOne({ where: { id: userId } });
        if (!user || !user.isActive || user.role.name !== "super_admin") {
            return res.status(403).json(
                { 
                    success: false, 
                    message: "Unauthorized" 
                }
            );
        }

        const appointment = await Appointment.findOne({ where: { id: appointmentId } });
        if (!appointment) {
            return res.status(404).json(
                { 
                    success: false, 
                    message: "Appointment not found" 
                }
            );
        }

        await Appointment.delete({ id: appointmentId });

        res.status(200).json(
            { 
                success: true, 
                message: "Appointment deleted successfully"
            }
        );
    } catch (error) {
        res.status(500).json(
            { 
                success: false, 
                message: "Error deleting appointment", 
                error: error 
            }
        );
    }
}

export const getAppointments = async (req: Request, res: Response) => {
    try {
        const { userId, roleName } = req.tokenData;
        const { date, serviceName, artistName, customerName } = req.query;
        interface queryFiltersI {
            date?: Date;
            serviceName?: FindOperator<string>;
            artistName?: FindOperator<string>;
            customerName?: FindOperator<string>;
        }
        
        const user = await User.findOne({ where: { id: userId, isActive: true } });
        if (!user) {
            return res.status(404).json(
                { 
                    success: false, 
                    message: "User not found" 
                }
            );
        }

        //validate if user.role.name = TokenData.roleName
        if (user.role.name !== roleName) {
            return res.status(403).json(
                { 
                    success: false, 
                    message: "Unauthorized" 
                }
            );
        }
        const appointmentFilters: queryFiltersI = {};

        //validate if user is artist or customer
        if (roleName === 'artist') {
            appointmentFilters.artistName = Like("%"+userId.toString()+"%");
            if (customerName) {
                appointmentFilters.customerName = Like("%"+customerName.toString()+"%");
            }
        } else if (roleName === 'customer') {
            appointmentFilters.customerName = Like("%"+userId.toString()+"%");
            if (artistName) {
                appointmentFilters.artistName = Like("%"+artistName.toString()+"%");
            }
        }

        if (date) {
            if (!isValidDate(date)) {
                return res.status(400).json(
                    { 
                        success: false, 
                        message: "Invalid date" 
                    }
                );
            }
            appointmentFilters.date = new Date(date.toString());
        }

        if (serviceName) {
            const service = await Service.findOne({ where: { name: serviceName as string} });
            if (!service) {
                return res.status(404).json(
                    { 
                        success: false, 
                        message: "Service not found" 
                    }
                );
            }
            appointmentFilters.serviceName = Like("%"+serviceName.toString()+"%");
        }

        if (artistName) {
            const artist = await User.findOne({ where: { name: artistName as string } });
            if (!artist) {
                return res.status(404).json(
                    { 
                        success: false, 
                        message: "Artist not found" 
                    }
                );
            }
            appointmentFilters.artistName = Like("%"+artistName.toString()+"%");
        }

        if (customerName) {
            const customer = await User.findOne({ where: { name: customerName as string} });
            if (!customer) {
                return res.status(404).json(
                    { 
                        success: false, 
                        message: "Customer not found" 
                    }
                );
            }
            appointmentFilters.customerName = Like("%"+customerName.toString()+"%");
        }

        const appointments = await Appointment.find(
            {
                where: appointmentFilters,
            }
        );
        
        res.status(200).json(
            { 
                success: true, 
                message: "Appointments retrieved successfully",
                data: appointments
            }
        );
    } catch (error) {
        res.status(500).json(
            { 
                success: false, 
                message: "Error fetching appointments", 
                error: error 
            }
        );
    }
}

