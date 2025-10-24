import mongoose, { Document, Schema } from "mongoose";

export interface IReviewSelection extends Document {
  reviewId: string;
  source: "hostaway" | "google";
  propertyId: string;
  isApproved: boolean;
  approvedBy: mongoose.Types.ObjectId;
  approvedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSelectionSchema: Schema = new Schema(
  {
    reviewId: {
      type: String,
      required: true,
      unique: true,
    },
    source: {
      type: String,
      enum: ["hostaway", "google"],
      required: true,
    },
    propertyId: {
      type: String,
      required: true,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    approvedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
ReviewSelectionSchema.index({ propertyId: 1, isApproved: 1 });
ReviewSelectionSchema.index({ source: 1, isApproved: 1 });

export default mongoose.model<IReviewSelection>(
  "ReviewSelection",
  ReviewSelectionSchema
);
