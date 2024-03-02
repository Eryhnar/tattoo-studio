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

export const updateCatalogueEntry = async (req: Request, res: Response) => {
    try {
        const targetCatalogueEntryId = parseInt(req.params.id);
        const { name, description, artistId, serviceId, price, beforeImage, afterImage  } = req.body;
        interface CatalogueEntryI {
            name?: string,
            description?: string,
            artistId?: number,
            serviceId?: number,
            price?: number,
            beforeImage?: string,
            afterImage?: string
        }
        const updateFields: CatalogueEntryI = {};

        if (name) {
            if (!validateCatalogueEntryName(name.trim())) {
                return res.status(400).json(
                    {
                        success: false,
                        message: "Invalid name"
                    }
                );
            }
            updateFields.name = name.trim();
        }

        if (description) {
            if (!validateCatalogueEntryDescription(description.trim())) {
                return res.status(400).json(
                    {
                        success: false,
                        message: "Invalid description"
                    }
                );
            }
            updateFields.description = description.trim();
        }

        if (artistId) {
            if (!validateId(artistId)) {
                return res.status(400).json(
                    {
                        success: false,
                        message: "Artist ID must be a possitive number"
                    }
                );
            }
            updateFields.artistId = artistId;
        }

        if (serviceId) {
            if (!validateId(serviceId)) {
                return res.status(400).json(
                    {
                        success: false,
                        message: "Service ID must be a possitive number"
                    }
                );
            }
            updateFields.serviceId = serviceId;
        }

        if (price) {
            if (!validatePrice(price)) {
                return res.status(400).json(
                    {
                        success: false,
                        message: "Price must be a possitive number"
                    }
                );
            }
            updateFields.price = price;
        }

        if (beforeImage) {
            if (!validateImageUrl(beforeImage.trim())) {
                return res.status(400).json(
                    {
                        success: false,
                        message: "Before image must be a valid URL"
                    }
                );
            }
            updateFields.beforeImage = beforeImage.trim();
        }

        if (afterImage) {
            if (!validateImageUrl(afterImage.trim())) {
                return res.status(400).json(
                    {
                        success: false,
                        message: "After image must be a valid URL"
                    }
                );
            }
            updateFields.afterImage = afterImage.trim();
        }

        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json(
                {
                    success: false,
                    message: "Please enter at least one field to update"
                }
            );
        }

        await Catalogue.update({ id: targetCatalogueEntryId }, updateFields);

        return res.status(200).json(
            {
                success: true,
                message: "Catalogue entry updated successfully"
            }
        );

    } catch (error) {

        return res.status(500).json(
            {
                success: false,
                message: "Error updating catalogue entry",
                error: error
            }
        );

    }
};

export const deleteCatalogueEntry = async (req: Request, res: Response) => {
    try {
        
        const targetCatalogueEntryId = parseInt(req.params.id);

        if (!validateId(targetCatalogueEntryId)) {
            return res.status(400).json(
                {
                    success: false,
                    message: "Invalid ID"
                }
            );
        }

        const targetCatalogueEntry = await Catalogue.findOne({ where: {id: targetCatalogueEntryId} });

        if (!targetCatalogueEntry) {
            return res.status(404).json(
                {
                    success: false,
                    message: "Catalogue entry not found"
                }
            );
        }

        const deletedEntry = await Catalogue.delete({ id: targetCatalogueEntryId }); 
        return res.status(200).json(
            {
                success: true,
                message: "Catalogue entry deleted successfully",
                data: deletedEntry
            }
        );
    } catch (error) {
        return res.status(500).json(
            {
                success: false,
                message: "Error deleting catalogue entry",
                error: error
            }
        );
    }
}