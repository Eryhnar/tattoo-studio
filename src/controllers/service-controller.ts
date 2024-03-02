import { Request, Response } from "express";
import { Service } from "../models/Service";

export const createService = async (req: Request, res: Response) => {
    try {
        const { name, description, price, photo } = req.body;
        interface ServiceFieldsI {
            name: string,
            description: string,
            price: number
            photo?: string
        }

        if (!name || !description || !price ) {
            return res.status(400).json(
                { 
                    success: false,
                    message: "Name, description and price are required"
                }
            );
        }

        const parsedPrice = parseFloat(price);
        if (isNaN(parsedPrice)) {
            return res.status(400).json(
                { 
                    success: false,
                    message: "Price must be a valid number"
                }
            );
        }

        const serviceFields: ServiceFieldsI = {
            name: name,
            description: description,
            price: parseFloat(price)
        }

        if (photo) {
            serviceFields.photo = photo;
        }

        if (await Service.findOne({ where: {name: name} })) {
            return res.status(400).json(
                { 
                    success: false,
                    message: "Service already exists"
                }
            );
        }


        const service = await Service.create(
            serviceFields
        ).save();
        return res.status(201).json(
            { 
                success: true,
                message: `Service ${service.name} created successfully`,
            }
        );
    } catch (error) {
        return res.status(500).json(
            { 
                success: false,
                message: "Error creating service",
                error: error
            }
        );
    }
}

export const getServices = async (req: Request, res: Response) => {
    try {
        const services = await Service.find();
        return res.status(200).json(
            { 
                success: true,
                message: "Services retrieved successfully",
                data: services
            }
        );
    } catch (error) {
        return res.status(500).json(
            {
                success: false,
                message: "Error fetching services",
                error: error
            }
        );
    }
}

export const updateService = async (req: Request, res: Response) => {
    try {
        const serviceId = parseInt(req.params.id);
        if (isNaN(serviceId)) {
            return res.status(400).json(
                { 
                    success: false,
                    message: "Invalid service id"
                }
            );
        }
        
        const { name, description, price, photo } = req.body;
        interface updateFieldsI {
            name?: string,
            description?: string,
            price?: number,
            photo?: string
        }

        const service = await Service.findOne({ where: {id: serviceId} });
        if (!service) {
            return res.status(404).json(
                { 
                    success: false,
                    message: "Service not found"
                }
            );
        }

        const updateFields: updateFieldsI = {};
        if (name) {
            updateFields.name = name;
        }
        if (description) {
            updateFields.description = description;
        }
        if (price) {
            updateFields.price = parseFloat(price);
        }
        if (photo) {
            updateFields.photo = photo;
        }

        await Service.update({id: serviceId}, updateFields);
        return res.status(200).json(
            { 
                success: true,
                message: "Service updated successfully"
            }
        );


    } catch (error) {
        res.status(500).json(
            {
                success: false,
                message: "Error updating service",
                error: error
            }
        );
    }
}

export const deleteService = async (req: Request, res: Response) => {
    try {
        const serviceId = parseInt(req.params.id);
        if (isNaN(serviceId)) {
            return res.status(400).json(
                { 
                    success: false,
                    message: "Invalid service id"
                }
            );
        }

        const service = await Service.findOne({ where: {id: serviceId} });
        if (!service) {
            return res.status(404).json(
                { 
                    success: false,
                    message: "Service not found"
                }
            );
        }

        await Service.delete({id: serviceId});
        return res.status(200).json(
            { 
                success: true,
                message: "Service deleted successfully"
            }
        );

    } catch (error) {
        res.status(500).json(
            {
                success: false,
                message: "Error deleting service",
                error: error
            }
        );
    }
}