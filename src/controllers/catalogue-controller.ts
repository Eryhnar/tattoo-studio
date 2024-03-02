import { Request, Response } from "express";
import { validateCatalogueEntryDescription, validateCatalogueEntryName, validateId, validateImageUrl, validatePrice } from "../helpers/validation-utilities";
import { Catalogue } from "../models/Catalogue";

export const createCatalogueEntry = async (req: Request, res: Response) => {
    try {
        const { name, description, artistId, serviceId, price, beforeImage, afterImage  } = req.body;
        interface CatalogueEntryI {
            name: string,
            description?: string,
            artistId: number,
            serviceId: number,
            price: number,
            beforeImage?: string,
            afterImage: string
        }
        const catalogueEntry: CatalogueEntryI = {
            name: "",
            artistId: 0,
            serviceId: 0,
            price: 0,
            afterImage: ""
        };

        if (!name || !artistId || !serviceId || !price || !afterImage) {
            return res.status(400).json(
                {
                    success: false,
                    message: "Please enter all fields"
                }
            );
        }
        
        //validate catalogue entry name 
        if (!validateCatalogueEntryName(name)) {
            return res.status(400).json(
                {
                    success: false,
                    message: "Invalid name"
                }
            );
        }
        catalogueEntry.name = name.trim();

        //validate description
        if (description && !validateCatalogueEntryDescription(description)) {
            return res.status(400).json(
                {
                    success: false,
                    message: "Invalid description"
                }
            );
        }
        if (description) {
            catalogueEntry.description = description.trim();
        }
        
        //validate artistId 
        if (!validateId(artistId)) {
            return res.status(400).json(
                {
                    success: false,
                    message: "Artist ID must be a possitive number"
                }
            );
        }
        catalogueEntry.artistId = artistId;

        //validate serviceId        
        if (!validateId(serviceId)) {
            return res.status(400).json(
                {
                    success: false,
                    message: "Service ID must be a possitive number"
                }
            );
        }
        catalogueEntry.serviceId = serviceId;

        //validate price 
        if (!validatePrice(price)) {
            return res.status(400).json(
                {
                    success: false,
                    message: "Price must be a possitive number"
                }
            );
        }
        catalogueEntry.price = price;

        //validate beforeImage 
        if (beforeImage && !validateImageUrl(beforeImage)) {
            return res.status(400).json(
                {
                    success: false,
                    message: "Before image must be a valid URL"
                }
            );
        }
        if (beforeImage) {
            catalogueEntry.beforeImage = beforeImage.trim();
        }

        //validate afterImage 
        if (!validateImageUrl(afterImage)) {
            return res.status(400).json(
                {
                    success: false,
                    message: "After image must be a valid URL"
                }
            );
        }
        catalogueEntry.afterImage = afterImage.trim();

        //create catalogue entry
        const newCatalogueEntry = await Catalogue.create(catalogueEntry).save();

        res.status(201).json(
            {
                success: true,
                message: "Catalogue entry created successfully",
                data: {
                    newCatalogueEntry
                }
            }
        );
    } catch (error) {
        res.status(500).json(
            {
                success: false,
                message: "Error creating catalogue entry",
                error: error
            }
        );
    }
}