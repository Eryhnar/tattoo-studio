import { Request, Response } from "express";
import { validateCatalogueEntryDescription, validateCatalogueEntryName, validateId, validateImageUrl, validatePrice } from "../helpers/validation-utilities";
import { Catalogue } from "../models/Catalogue";
import { User } from "../models/User";
import { Service } from "../models/Service";
import { FindOperator, Like } from "typeorm";

export const createCatalogueEntry = async (req: Request, res: Response) => {
    try {
        const { name, description, artistId, serviceId, price, beforeImage, afterImage  } = req.body;
        interface CatalogueEntryI {
            description?: string,
            beforeImage?: string,
        }
        const catalogueEntry: CatalogueEntryI = {};

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
        if (!validateId(parseInt(artistId))) {
            return res.status(400).json(
                {
                    success: false,
                    message: "Artist ID must be a positive number"
                }
            );
        }
        const artist = await User.findOne(
            { 
                where: { id: parseInt(artistId) },
                relations: {
                    role: true
                } 
            }
        );
        console.log(artist);

        if (artist?.role.name !== "artist" || !artist) {
            return res.status(404).json(
                {
                    success: false,
                    message: "Artist not found"
                }
            );
        }

        //validate serviceId        
        if (!validateId(parseInt(serviceId))) {
            return res.status(400).json(
                {
                    success: false,
                    message: "Service ID must be a positive number"
                }
            );
        }
        const service = await Service.findOne({ where: { id: parseInt(serviceId) } });
        if (!service) {
            return res.status(404).json(
                {
                    success: false,
                    message: "Service not found"
                }
            );
        }

        //validate price 
        if (!validatePrice(parseInt(price))) {
            return res.status(400).json(
                {
                    success: false,
                    message: "Price must be a positive number"
                }
            );
        }

        //validate beforeImage TODO fix URL validation TODO validate it does not exist
        // if (beforeImage && !validateImageUrl(beforeImage)) {
        //     return res.status(400).json(
        //         {
        //             success: false,
        //             message: "Before image must be a valid URL"
        //         }
        //     );
        // }
        if (beforeImage) {
            catalogueEntry.beforeImage = beforeImage.trim();
        }

        //validate afterImage TODO validate it does not exist
        // if (!validateImageUrl(afterImage)) {
        //     return res.status(400).json(
        //         {
        //             success: false,
        //             message: "After image must be a valid URL"
        //         }
        //     );
        // }
        //create catalogue entry
        //const newCatalogueEntry = await Catalogue.create(catalogueEntry).save();
        const newCatalogueEntry = await Catalogue.create(
            {
                name: name.trim() as string,
                description: catalogueEntry.description ? catalogueEntry.description.trim() : undefined,
                artist: artist as User,
                service: service as Service,
                price: parseInt(price) as number,
                beforeImage: catalogueEntry.beforeImage ? catalogueEntry.beforeImage.trim() : undefined,
                afterImage: afterImage.trim() as string
            }
        ).save();

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
            artist?: User,
            service?: Service,
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
            const artist = await User.findOne(
                { 
                    where: { id: parseInt(artistId) },
                    relations: {
                        role: true
                    } 
                }
            );
    
            if (artist?.role.name === "artist" || !artist) {
                return res.status(404).json(
                    {
                        success: false,
                        message: "Artist not found"
                    }
                );
            }
            updateFields.artist = artist;
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
            const service = await Service.findOne({ where: { id: parseInt(serviceId) } });
            if (!service) {
                return res.status(404).json(
                    {
                        success: false,
                        message: "Service not found"
                    }
                );
            }
            updateFields.service = serviceId;
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
        // TODO validate beforeImage does not exist in the database
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
        // TODO validate afterImage does not exist in the database
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

export const getCatalogueEntries = async (req: Request, res: Response) => {
    try {
        const { name, artistId, serviceId, artistName, serviceName } = req.query;
        interface catalogueEntriesFiltersI {
            name?: FindOperator<string>,
            artistId?: FindOperator<string>,
            serviceId?: FindOperator<string>,
            artistName?: FindOperator<string>,
            serviceName?: FindOperator<string>
        }
        const catalogueEntriesFilters: catalogueEntriesFiltersI = {};

        if (name) {
            catalogueEntriesFilters.name = Like("%" + name + "%");
        }
        
        if (artistId) {
            const artistIdInt = parseInt(artistId as string);
            // if (!validateId(artistIdInt)) {
            //     return res.status(400).json(
            //         {
            //             success: false,
            //             message: "Invalid artist ID"
            //         }
            //     );
            // }
            catalogueEntriesFilters.artistId = Like("%" + artistIdInt + "%");
        }
        
        if (serviceId) {
            const serviceIdInt = parseInt(serviceId as string);
            // if (!validateId(serviceIdInt)) {
            //     return res.status(400).json(
            //         {
            //             success: false,
            //             message: "Invalid service ID"
            //         }
            //     );
            // }
            catalogueEntriesFilters.serviceId = Like("%" + serviceIdInt + "%");
        }

        if (artistName) {
            // TODO validate artistName ??
            catalogueEntriesFilters.artistName = Like("%" + artistName + "%");
        }

        if (serviceName) {
            // TODO validate serviceName ??
            catalogueEntriesFilters.serviceName = Like("%" + serviceName + "%");
        }

        const catalogueEntries = await Catalogue.find(
            { 
                where: catalogueEntriesFilters,
                relations: {
                    artist: true,
                    service: true
                },
                select: {
                    name: true,
                    description: true,
                    artist: {
                        name: true,
                    },
                    service: {
                        name: true
                    },
                    price: true,
                    beforeImage: true,
                    afterImage: true,
                }
            }
        );

        //const catalogueEntries = await Catalogue.find();
        return res.status(200).json(
            {
                success: true,
                message: "Catalogue entries retrieved successfully",
                data: catalogueEntries
            }
        );
    } catch (error) {
        return res.status(500).json(
            {
                success: false,
                message: "Error retrieving catalogue entries",
                error: error
            }
        );
    }
}