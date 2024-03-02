import { Request, Response } from "express";
import { Appointment } from "../models/Appointment";
import { User } from "../models/User";
import { Service } from "../models/Service";
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
} //createAppointment