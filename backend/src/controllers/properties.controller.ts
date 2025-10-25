import { Request, Response } from "express";
import Property from "../models/Property";
import { HostawayService } from "../services/hostaway";

export class PropertiesController {
  private hostawayService = new HostawayService();

  async getProperties(req: Request, res: Response): Promise<void> {
    try {
      const { city, arrondissement, minBedrooms, maxPrice, status, guests } =
        req.query;

      const filter: any = {};

      if (city) {
        filter.city = city;
      }

      if (arrondissement) {
        filter.arrondissement = arrondissement;
      }

      if (minBedrooms) {
        filter.bedrooms = { $gte: parseInt(minBedrooms as string) };
      }

      if (maxPrice) {
        filter.$or = [
          { pricePerMonth: { $lte: parseInt(maxPrice as string) } },
          { pricePerNight: { $lte: parseInt(maxPrice as string) / 30 } },
        ];
      }

      if (guests) {
        filter.maxGuests = { $gte: parseInt(guests as string) };
      }

      if (status) {
        filter.status = status;
      }

      const properties = await Property.find(filter).sort({ createdAt: -1 });

      res.json({
        success: true,
        data: properties,
      });
    } catch (error) {

      res.status(500).json({
        success: false,
        message: "Failed to get properties",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async getPublicProperties(req: Request, res: Response): Promise<void> {
    try {
      const { city, arrondissement, minBedrooms, maxPrice, guests } = req.query;

      const filter: any = {
        approved: true,
        status: "approved",
      };

      if (city) {
        filter.city = city;
      }

      if (arrondissement) {
        filter.arrondissement = arrondissement;
      }

      if (minBedrooms) {
        filter.bedrooms = { $gte: parseInt(minBedrooms as string) };
      }

      if (maxPrice) {
        filter.$or = [
          { pricePerMonth: { $lte: parseInt(maxPrice as string) } },
          { pricePerNight: { $lte: parseInt(maxPrice as string) / 30 } },
        ];
      }

      if (guests) {
        filter.maxGuests = { $gte: parseInt(guests as string) };
      }

      const properties = await Property.find(filter).sort({ createdAt: -1 });

      res.json({
        success: true,
        data: properties,
      });
    } catch (error) {

      res.status(500).json({
        success: false,
        message: "Failed to get properties",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async getProperty(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const property = await Property.findById(id);

      if (!property) {
        res.status(404).json({
          success: false,
          message: "Property not found",
        });
        return;
      }

      if (!property.approved || property.status !== "approved") {
        res.status(404).json({
          success: false,
          message: "Property not found",
        });
        return;
      }

      res.json({
        success: true,
        data: property,
      });
    } catch (error) {

      res.status(500).json({
        success: false,
        message: "Failed to get property",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async getAdminProperty(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const property = await Property.findById(id);

      if (!property) {
        res.status(404).json({
          success: false,
          message: "Property not found",
        });
        return;
      }

      res.json({
        success: true,
        data: property,
      });
    } catch (error) {

      res.status(500).json({
        success: false,
        message: "Failed to get property",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async createProperty(req: Request, res: Response): Promise<void> {
    try {
      const propertyData = req.body;

      const property = new Property(propertyData);
      await property.save();

      res.status(201).json({
        success: true,
        message: "Property created successfully",
        data: property,
      });
    } catch (error) {

      res.status(500).json({
        success: false,
        message: "Failed to create property",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async updateProperty(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updates = req.body;

      const property = await Property.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
      });

      if (!property) {
        res.status(404).json({
          success: false,
          message: "Property not found",
        });
        return;
      }

      res.json({
        success: true,
        message: "Property updated successfully",
        data: property,
      });
    } catch (error) {

      res.status(500).json({
        success: false,
        message: "Failed to update property",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async deleteProperty(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const property = await Property.findByIdAndDelete(id);

      if (!property) {
        res.status(404).json({
          success: false,
          message: "Property not found",
        });
        return;
      }

      res.json({
        success: true,
        message: "Property deleted successfully",
      });
    } catch (error) {

      res.status(500).json({
        success: false,
        message: "Failed to delete property",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async getPropertyByName(req: Request, res: Response): Promise<void> {
    try {
      const { name } = req.params;

      const property = await Property.findOne({
        name: { $regex: name, $options: "i" },
      });

      if (!property) {
        res.status(404).json({
          success: false,
          message: "Property not found",
        });
        return;
      }

      res.json({
        success: true,
        data: property,
      });
    } catch (error) {

      res.status(500).json({
        success: false,
        message: "Failed to get property",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async syncHostawayListings(req: Request, res: Response): Promise<void> {
    try {

      const hostawayListings = await this.hostawayService.getListings();
      let syncedCount = 0;
      let updatedCount = 0;
      let createdCount = 0;

      for (const hostawayListing of hostawayListings) {
        const propertyData =
          this.hostawayService.transformHostawayListingToProperty(
            hostawayListing
          );

        const existingProperty = await Property.findOne({
          hostawayListingId: propertyData.hostawayListingId,
        });

        if (existingProperty) {
          await Property.findByIdAndUpdate(existingProperty._id, {
            ...propertyData,
            approved: existingProperty.approved,
            status: existingProperty.status,
          });

          updatedCount++;
        } else {

          const newProperty = new Property(propertyData);
          await newProperty.save();

          createdCount++;
        }
        syncedCount++;
      }

      res.json({
        success: true,
        message: "Hostaway listings synced successfully",
        data: {
          totalProcessed: syncedCount,
          created: createdCount,
          updated: updatedCount,
        },
      });
    } catch (error) {

      res.status(500).json({
        success: false,
        message: "Failed to sync Hostaway listings",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async approveProperty(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const property = await Property.findByIdAndUpdate(
        id,
        {
          approved: true,
          status: "approved",
        },
        { new: true }
      );

      if (!property) {
        res.status(404).json({
          success: false,
          message: "Property not found",
        });
        return;
      }

      res.json({
        success: true,
        message: "Property approved successfully",
        data: property,
      });
    } catch (error) {

      res.status(500).json({
        success: false,
        message: "Failed to approve property",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async rejectProperty(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const property = await Property.findByIdAndUpdate(
        id,
        {
          approved: false,
          status: "rejected",
        },
        { new: true }
      );

      if (!property) {
        res.status(404).json({
          success: false,
          message: "Property not found",
        });
        return;
      }

      res.json({
        success: true,
        message: "Property rejected successfully",
        data: property,
      });
    } catch (error) {

      res.status(500).json({
        success: false,
        message: "Failed to reject property",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}

export default new PropertiesController();
