import { Request, Response } from "express";
import { Service } from "../models/Service";

export const createService = async (req: Request, res: Response) => {
    try {
        const { name, description, price } = req.body;

        if (!name || !description || !price) {
            return res.status(400).json(
                { 
                    success: false,
                    message: "Name, description and price are required"
                }
            );
        }

        if (await Service.findOne({ where: {name: name} })) {
            return res.status(400).json(
                { 
                    success: false,
                    message: "Service already exists"
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

        const service = await Service.create(
            {
                name: name,
                description: description,
                price: parsedPrice
            }
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
        return res.status(500).json({
            success: false,
            message: "Error fetching services",
            error: error
        });
    }
}