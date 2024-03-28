import { Request, Response } from "express";
import { Appointment, AppointmentStatus } from "../models/Appointment";
import { User } from "../models/User";
import { Service } from "../models/Service";
import { FindOperator, Like, Not } from "typeorm";
import { isValidDate, validateId } from "../helpers/validation-utilities";
import { Catalogue } from "../models/Catalogue";
//import Reference from 'typeorm';

export const createAppointment = async (req: Request, res: Response) => {
    try {
        const { serviceId, artistId, date,  customerId, catalogueId } = req.body;
        //TODO fix types
        let customer: User | null;
        let artist: User | null;
        let service: Service | null;
        let catalogueEnty: Catalogue | null = null;

        //TODO I think role is already in req.body.user
        const user = await User.findOne(
            { 
                where: { id: req.tokenData.userId },
                relations: {
                    role: true
                },
                select: {
                    id: true,
                    name: true,
                    role: {
                        name: true
                    }
                }
            }
        );
        if (user?.role.name === "customer") {
            customer = user;
            if (!artistId) {
                return res.status(400).json(
                    { 
                        success: false, 
                        message: "Please enter artistId" 
                    }
                );
            }
            artist = await User.findOne(
                { 
                    where: { id: artistId },
                    relations: {
                        role: true
                    },
                    select: {
                        id: true,
                        name: true,
                        role: {
                            name: true
                        }
                    } 
                }
            );
        } else { //TODO edit to allow artitsts to assign appointment to another artist
            artist = user;
            customer = await User.findOne(
                { 
                    where: { id: customerId },
                    relations: {
                        role: true
                    },
                    select: {
                        id: true,
                        name: true,
                        role: {
                            name: true
                        }
                    } 
                }
            );
        }
        if (!customer || !artist) {
            return res.status(404).json(
                { 
                    success: false, 
                    message: "User not found" 
                }
            );
        }
        if (artist.role.name !== "artist" ) { //because every user can be the customer of an appointment but only an artist can be the artist
            return res.status(400).json(
                { 
                    success: false, 
                    message: "Invalid artist" 
                }
            );
        }

        if (!serviceId || !date ) {
            return res.status(400).json(
                { 
                    success: false, 
                    message: "Please enter serviceId, date and time" 
                }
            );
        }

        if (catalogueId) {
            const catalogueEnty = await Catalogue.findOne({ where: { id: catalogueId } });
            if (!catalogueEnty) {
                return res.status(404).json(
                    { 
                        success: false, 
                        message: "Catalogue entry not found" 
                    }
                );
            }
        }
        //no
        // const customer = await User.findOne({ where: { id: customerId } });
        // if (!customer) {
        //     return res.status(404).json(
        //         { 
        //             success: false, 
        //             message: "User not found" 
        //         }
        //     );
        // }
        //no
        // const artist = await User.findOne({ where: { id: artistId } });
        // if (!artist) {
        //     return res.status(404).json(
        //         { 
        //             success: false, 
        //             message: "Artist not found" 
        //         }
        //     );
        // }

        service = await Service.findOne({ where: { id: serviceId } });
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
                catalogue: catalogueEnty
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
//TODO!!!
// if the token holder is customer take everything from the request body
// if the token holder is NOT customer require EVERYTHING from the request body
export const updateAppointment = async (req: Request, res: Response) => {
    try {
        //get the variables from the request
        const appointmentId = parseInt(req.params.id);
        const userId = req.tokenData.userId;
        const { date, artistId, serviceId, catalogueId } = req.body;
        interface AppointmentFiltersI {
            date?: Date;
            artist?: User;
            service?: Service;
            catalogueEntry?: Catalogue;
            //duration: number;
        }
        const appointmentFilters: AppointmentFiltersI = {};

        const user = await User.findOne(
            { 
                where: { id: userId },
                relations: {
                    role: true
                }, 
            }
        );
        if (!user) {
            return res.status(404).json(
                { 
                    success: false, 
                    message: "Authentication error" 
                }
            );
        }
        //validate appointmente exists
        const appointment = await Appointment.findOne(
            { 
                where: { id: appointmentId },
                relations: {
                    customer: true,
                    artist: true,
                    service: true,
                    catalogue: true,
                } 
            }
        );

        if (!appointment) {
            return res.status(404).json(
                { 
                    success: false, 
                    message: "Appointment not found" 
                }
            );
        }
        // if user is customer, validate the appointment belongs to the customer
        if (user.role.name === "customer" && appointment.customer.id !== userId) {
            return res.status(403).json(
                { 
                    success: false, 
                    message: "Unauthorized" 
                }
            );
        }

        //validate the service exists
        if (serviceId) {
            const newService = await Service.findOne({ where: { id: serviceId } });
            if (!newService) {
                return res.status(404).json(
                    { 
                        success: false, 
                        message: "Service not found" 
                    }
                );
            }
            appointmentFilters.service = newService;
        }

        //validate the artist exists
        if (artistId) {
            const newArtist = await User.findOne({ where: { id: artistId } });
            if (!newArtist) {
                return res.status(404).json(
                    { 
                        success: false, 
                        message: "Artist not found" 
                    }
                );
            }
            appointmentFilters.artist = newArtist;
        }

        //validate the date is in the future
        if (date) {
            const appointmentDate = new Date(date);
            if (appointmentDate < new Date()) {
                return res.status(400).json(
                    { 
                        success: false, 
                        message: "Invalid date" 
                    }
                );
            }
        }

        //validate the customer is available 
        if (date) {
            const customerAppointments = await Appointment.find({ 
                where: { 
                    customer: appointment.customer, 
                    date: date,
                    id: Not(appointmentId) // Exclude the appointment being modified
                } 
            });
            if (customerAppointments.length > 0) {
                return res.status(400).json(
                    { 
                        success: false, 
                        message: "Customer already has an appointment at that time" 
                    }
                );
            }

            // Validate the artist is available
            const artistAppointments = await Appointment.find({ 
                where: { 
                    artist: appointmentFilters.artist, 
                    date: date,
                    id: Not(appointmentId) // Exclude the appointment being modified
                } 
            });
            if (artistAppointments.length > 0) {
                return res.status(400).json(
                    { 
                        success: false, 
                        message: "Artist is not available at that time" 
                    }
                );
            }
            appointmentFilters.date = date;
        }

        //validate the catalogue entry exists
        if (catalogueId) {
            const newCatalogueEntry = await Catalogue.findOne({ where: { id: catalogueId } });
            if (!newCatalogueEntry) {
                return res.status(404).json(
                    { 
                        success: false, 
                        message: "Catalogue entry not found" 
                    }
                );
            }
            appointmentFilters.catalogueEntry = newCatalogueEntry;
        }
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

// TODO if the token holder is customer, validate the appointment belongs to the customer
// if 
export const cancelAppointment = async (req: Request, res: Response) => {
    try {
        const appointmentId = parseInt(req.params.id);
        const userId = req.tokenData.userId;

        const user = await User.findOne(
            { 
                where: { id: userId },
                relations: {
                    role: true
                }, 
            }
        );

        if (!user) {
            return res.status(404).json(
                { 
                    success: false, 
                    message: "User not found" 
                }
            );
        }

        const appointment = await Appointment.findOne(
            { 
                where: { id: appointmentId },
                relations: {
                    customer: true,
                    artist: true,
                    service: true,
                    catalogue: true,
                } 
            }
        );
        if (!appointment || appointment.status !== "pending") {
            return res.status(404).json(
                { 
                    success: false, 
                    message: "Appointment not found" 
                }
            );
        }

        if (user.role.name === "customer" && appointment.customer.id !== userId) {
            return res.status(403).json(
                { 
                    success: false, 
                    message: "Unauthorized" 
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
        // const userId = req.tokenData.userId;
        const appointmentId = parseInt(req.params.id);
        const user = req.body.tokenUser
        // const user = await User.findOne({ where: { id: userId } });
        // if (!user || !user.isActive || user.role.name !== "super_admin") {
        //     return res.status(403).json(
        //         { 
        //             success: false, 
        //             message: "Unauthorized" 
        //         }
        //     );
        // }

        const appointment = await Appointment.findOne(
            { 
                where: { id: appointmentId },
                relations: {
                    customer: true,
                    artist: true,
                    service: true,
                    catalogue: true,
                }
            }
        );

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

export const getOwnAppointments = async (req: Request, res: Response) => {
    try {
        const { userId, roleName } = req.tokenData;
        const customer = await User.findOne({ where: { id: userId } });
        if (!customer) {
            return res.status(404).json(
                { 
                    success: false, 
                    message: "User not found" 
                }
            );
        }
        const appointments = await Appointment.find(
            { 
                where: { customer: customer },
                relations: {
                    customer: true,
                    artist: true,
                    service: true,
                    catalogue: true
                }
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

export const getAppointments = async (req: Request, res: Response) => {
    try {
        const { userId, roleName } = req.tokenData;
        const { date, serviceName, artistName, customerName, catalogueEntry } = req.query;
        interface queryFiltersI {
            date?: Date;
            serviceName?: FindOperator<string>;
            artistName?: FindOperator<string>;
            customerName?: FindOperator<string>;
            catalogueEntry?: FindOperator<string>;
            userId?: number;
        }
        
        const user = await User.findOne(
            { 
                where: { id: userId },
                relations: {
                    role: true
                }, 
            }
        );
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

        //TODO check if redundant
        //validate if user is artist or customer
        if (roleName === 'artist') {
            appointmentFilters.artistName = Like("%"+user.name.toString()+"%");
            if (customerName) {
                appointmentFilters.customerName = Like("%"+customerName.toString()+"%");
            }
        } else if (roleName === 'customer') {
            appointmentFilters.customerName = Like("%"+user.name.toString()+"%");
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
        /*
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
        }*/
        if (catalogueEntry) {
            const catalogue = await Catalogue.findOne(
                { 
                    where: { name: catalogueEntry as string },
                    relations: {
                        appointments: true
                    }
                }
            );
            if (!catalogue) {
                return res.status(404).json(
                    { 
                        success: false, 
                        message: "Catalogue entry not found" 
                    }
                );
            }
            appointmentFilters.catalogueEntry = Like("%"+catalogueEntry.toString()+"%");
        }

        let appointments: Appointment[] = [];
        if (user.role.name === 'super_admin') {
            appointments = await Appointment.find(
                {
                    where: appointmentFilters,
                    relations: {
                        customer: true,
                        artist: true,
                        service: true,
                        catalogue: true
                    }
                }
            );
        
        } else {
            appointmentFilters.userId = userId;
            appointments = await Appointment.find(
                {
                    where: appointmentFilters,
                    relations: {
                        customer: true,
                        artist: true,
                        service: true,
                        catalogue: true
                    }
                }
            );
        }
        
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

export const getAppointmentById = async (req: Request, res: Response) => {
    try {
        const { userId, roleName } = req.tokenData;
        const appointmentId = parseInt(req.params.id);
        const user = req.body.tokenUser
        let appointment: Appointment | null;

        if (user.role.name === "customer") {
            appointment = await Appointment.findOne({ where: { id: appointmentId, customer: user } });
        } else {
            appointment = await Appointment.findOne(
                { 
                    where: { id: appointmentId },
                    relations: {
                        customer: true,
                        artist: true,
                        service: true,
                        catalogue: true
                    }
                }
            );
        }

        //TODO validate appointment id
        if (!appointment) {
            return res.status(404).json(
                { 
                    success: false, 
                    message: "Appointment not found" 
                }
            );
        }

        res.status(200).json(
            { 
                success: true, 
                message: "Appointment retrieved successfully",
                data: appointment
            }
        );

    } catch (error) {
        res.status(500).json(
            { 
                success: false, 
                message: "Error fetching appointment", 
                error: error 
            }
        );
    }
}

// export const getAllAppointments = async (req: Request, res: Response) => {
//     try {

//         const appointments = await Appointment.find();

//         res.status(200).json(
//             { 
//                 success: true, 
//                 message: "Appointments retrieved successfully",
//                 data: appointments
//             }
//         );
//     } catch (error) {
//         res.status(500).json(
//             { 
//                 success: false, 
//                 message: "Error fetching appointments", 
//                 error: error 
//             }
//         );
//     }
// }