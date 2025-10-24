import mongoose, { Document, Schema } from "mongoose";
import { Property } from "../types";

export interface IProperty extends Property, Document {}

const PropertySchema = new Schema<IProperty>(
  {
    name: {
      type: String,
      required: true,
    },
    hostawayId: String,
    hostawayListingId: String,
    googlePlaceId: String,
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
      default: "Paris",
    },
    arrondissement: String,
    description: String,
    bedrooms: {
      type: Number,
      required: true,
      default: 1,
    },
    bathrooms: {
      type: Number,
      required: true,
      default: 1,
    },
    maxGuests: {
      type: Number,
      required: true,
      default: 2,
    },
    size: {
      type: Number,
      required: true,
    },
    pricePerNight: Number,
    pricePerMonth: Number,
    amenities: {
      type: [String],
      default: [],
    },
    images: {
      type: [String],
      default: [],
    },
    propertyType: {
      type: String,
      required: true,
      default: "Apartment",
    },
    availableFrom: Date,
    minimumStay: {
      type: Number,
      default: 30,
    },
    features: {
      type: [String],
      default: [],
    },
    nearbyTransport: {
      type: [String],
      default: [],
    },
    approved: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
PropertySchema.index({ hostawayId: 1 });
PropertySchema.index({ hostawayListingId: 1 });
PropertySchema.index({ googlePlaceId: 1 });
PropertySchema.index({ name: 1 });
PropertySchema.index({ city: 1 });
PropertySchema.index({ arrondissement: 1 });
PropertySchema.index({ approved: 1 });
PropertySchema.index({ status: 1 });
PropertySchema.index({ name: "text", address: "text" });

export default mongoose.model<IProperty>("Property", PropertySchema);
