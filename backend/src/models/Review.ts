import mongoose, { Document, Schema } from "mongoose";
import { NormalizedReview } from "../types";

export interface IReview extends NormalizedReview, Document {}

const ReviewCategorySchema = new Schema(
  {
    category: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 10 },
  },
  { _id: false }
);

const ReviewSchema = new Schema<IReview>(
  {
    source: {
      type: String,
      required: true,
      enum: ["hostaway", "google"],
    },
    sourceId: {
      type: String,
      required: true,
    },
    listingId: {
      type: String,
    },
    listingName: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
    reviewText: {
      type: String,
      required: true,
    },
    reviewerName: {
      type: String,
      required: true,
    },
    categories: [ReviewCategorySchema],
    channel: {
      type: String,
    },
    submittedAt: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    placeId: {
      type: String,
    },
    address: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

ReviewSchema.index({ source: 1, sourceId: 1 }, { unique: true });
ReviewSchema.index({ listingName: 1 });
ReviewSchema.index({ status: 1 });
ReviewSchema.index({ isPublic: 1 });
ReviewSchema.index({ submittedAt: -1 });

export default mongoose.model<IReview>("Review", ReviewSchema);
