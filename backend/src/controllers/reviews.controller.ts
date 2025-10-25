import { Request, Response } from "express";
import Review from "../models/Review";
import Property from "../models/Property";
import { HostawayService } from "../services/hostaway";
import { GooglePlacesService } from "../services/googlePlaces";
import { DashboardStats } from "../types";

export class ReviewsController {
  private hostawayService = new HostawayService();
  private googleService = new GooglePlacesService();

  async fetchHostawayReviews(req: Request, res: Response): Promise<void> {
    try {
      const normalizedReviews = await this.hostawayService.fetchReviews(
        1000,
        0
      );

      const savedReviews = [];
      for (const review of normalizedReviews) {
        const existingReview = await Review.findOne({
          source: review.source,
          sourceId: review.id,
        });

        if (existingReview) {
          Object.assign(existingReview, review);
          await existingReview.save();
          savedReviews.push(existingReview);
        } else {
          const newReview = new Review(review);
          await newReview.save();
          savedReviews.push(newReview);
        }
      }

      res.json({
        success: true,
        message: `Synced ${savedReviews.length} Hostaway reviews`,
        data: savedReviews,
      });
    } catch (error) {

      res.status(500).json({
        success: false,
        message: "Failed to fetch Hostaway reviews",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async fetchGoogleReviews(req: Request, res: Response): Promise<void> {
    try {
      const { query } = req.query;

      if (!query || typeof query !== "string") {
        res.status(400).json({
          success: false,
          message: "Query parameter is required for Google reviews search",
        });
        return;
      }

      const normalizedReviews =
        await this.googleService.searchFlexLivingReviews();

      const savedReviews = [];
      for (const review of normalizedReviews) {
        const existingReview = await Review.findOne({
          source: review.source,
          sourceId: review.id,
        });

        if (existingReview) {

          Object.assign(existingReview, review);
          await existingReview.save();
          savedReviews.push(existingReview);
        } else {

          const newReview = new Review(review);
          await newReview.save();
          savedReviews.push(newReview);
        }
      }

      res.json({
        success: true,
        message: `Synced ${savedReviews.length} Google reviews`,
        data: savedReviews,
      });
    } catch (error) {

      res.status(500).json({
        success: false,
        message: "Failed to fetch Google reviews",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async syncAllReviews(req: Request, res: Response): Promise<void> {
    try {
      const results = {
        hostaway: { success: false, count: 0, error: null as string | null },
        google: { success: false, count: 0, error: null as string | null },
      };

      try {
        const hostawayReviews = await this.hostawayService.fetchReviews(
          1000,
          0
        );
        for (const review of hostawayReviews) {
          await Review.findOneAndUpdate(
            { source: review.source, sourceId: review.id },
            review,
            { upsert: true, new: true }
          );
        }
        results.hostaway = {
          success: true,
          count: hostawayReviews.length,
          error: null,
        };
      } catch (error) {
        results.hostaway.error =
          error instanceof Error ? error.message : "Unknown error";
      }

      try {
        const searchTerms = [
          "Flex Living",
          "short term rental",
          "vacation rental",
        ];
        let totalGoogleReviews = 0;

        for (const term of searchTerms) {
          try {
            const googleReviews =
              await this.googleService.searchFlexLivingReviews();
            for (const review of googleReviews) {
              await Review.findOneAndUpdate(
                { source: review.source, sourceId: review.id },
                review,
                { upsert: true, new: true }
              );
            }
            totalGoogleReviews += googleReviews.length;
          } catch (error) {

          }
        }
        results.google = {
          success: true,
          count: totalGoogleReviews,
          error: null,
        };
      } catch (error) {
        results.google.error =
          error instanceof Error ? error.message : "Unknown error";
      }

      res.json({
        success: true,
        message: "Sync completed",
        data: results,
      });
    } catch (error) {

      res.status(500).json({
        success: false,
        message: "Failed to sync reviews",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async getReviews(req: Request, res: Response): Promise<void> {
    try {
      const {
        page = 1,
        limit = 20,
        rating,
        source,
        status,
        property,
        dateFrom,
        dateTo,
        sortBy = "submittedAt",
        sortOrder = "desc",
      } = req.query;

      const filter: any = {};

      if (rating) {
        filter.rating = { $gte: parseInt(rating as string) };
      }

      if (source) {
        filter.source = source;
      }

      if (status) {
        filter.status = status;
      }

      if (property) {
        filter.listingName = { $regex: property, $options: "i" };
      }

      if (dateFrom || dateTo) {
        filter.submittedAt = {};
        if (dateFrom) {
          filter.submittedAt.$gte = new Date(dateFrom as string);
        }
        if (dateTo) {
          filter.submittedAt.$lte = new Date(dateTo as string);
        }
      }

      const sort: any = {};
      sort[sortBy as string] = sortOrder === "desc" ? -1 : 1;

      const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

      const reviews = await Review.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit as string));

      const total = await Review.countDocuments(filter);

      res.json({
        success: true,
        data: reviews,
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total,
          pages: Math.ceil(total / parseInt(limit as string)),
        },
      });
    } catch (error) {

      res.status(500).json({
        success: false,
        message: "Failed to get reviews",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async updateReviewStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!["pending", "approved", "rejected"].includes(status)) {
        res.status(400).json({
          success: false,
          message: "Invalid status. Must be pending, approved, or rejected",
        });
        return;
      }

      const review = await Review.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );

      if (!review) {
        res.status(404).json({
          success: false,
          message: "Review not found",
        });
        return;
      }

      res.json({
        success: true,
        message: "Review status updated",
        data: review,
      });
    } catch (error) {

      res.status(500).json({
        success: false,
        message: "Failed to update review status",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async toggleReviewPublic(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const review = await Review.findById(id);
      if (!review) {
        res.status(404).json({
          success: false,
          message: "Review not found",
        });
        return;
      }

      if (review.status !== "approved") {
        res.status(400).json({
          success: false,
          message: "Only approved reviews can be made public",
        });
        return;
      }

      review.isPublic = !review.isPublic;
      await review.save();

      res.json({
        success: true,
        message: `Review ${review.isPublic ? "made public" : "made private"}`,
        data: review,
      });
    } catch (error) {

      res.status(500).json({
        success: false,
        message: "Failed to toggle review public status",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async getPublicReviews(req: Request, res: Response): Promise<void> {
    try {
      const { property } = req.query;

      const filter: any = {
        status: "approved",
        isPublic: true,
      };

      if (property) {
        filter.listingName = { $regex: property, $options: "i" };
      }

      const reviews = await Review.find(filter)
        .sort({ submittedAt: -1 })
        .limit(50);

      res.json({
        success: true,
        data: reviews,
      });
    } catch (error) {

      res.status(500).json({
        success: false,
        message: "Failed to get public reviews",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async getDashboardStats(req: Request, res: Response): Promise<void> {
    try {
      const totalReviews = await Review.countDocuments();
      const pendingReviews = await Review.countDocuments({ status: "pending" });
      const approvedReviews = await Review.countDocuments({
        status: "approved",
      });
      const rejectedReviews = await Review.countDocuments({
        status: "rejected",
      });

      const avgRatingResult = await Review.aggregate([
        { $group: { _id: null, avgRating: { $avg: "$rating" } } },
      ]);
      const averageRating =
        avgRatingResult.length > 0 ? avgRatingResult[0].avgRating : 0;

      const reviewsBySource = await Review.aggregate([
        { $group: { _id: "$source", count: { $sum: 1 } } },
      ]);

      const reviewsByProperty = await Review.aggregate([
        {
          $group: {
            _id: "$listingName",
            totalReviews: { $sum: 1 },
            averageRating: { $avg: "$rating" },
          },
        },
        { $sort: { totalReviews: -1 } },
        { $limit: 10 },
      ]);

      const recentReviews = await Review.find()
        .sort({ submittedAt: -1 })
        .limit(5);

      const stats: DashboardStats = {
        totalReviews,
        averageRating: Math.round(averageRating * 10) / 10,
        pendingReviews,
        approvedReviews,
        rejectedReviews,
        reviewsBySource: {
          hostaway:
            reviewsBySource.find((r) => r._id === "hostaway")?.count || 0,
          google: reviewsBySource.find((r) => r._id === "google")?.count || 0,
        },
        reviewsByProperty: reviewsByProperty.map((p) => ({
          propertyName: p._id,
          totalReviews: p.totalReviews,
          averageRating: Math.round(p.averageRating * 10) / 10,
        })),
        recentReviews,
      };

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {

      res.status(500).json({
        success: false,
        message: "Failed to get dashboard stats",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}

export default new ReviewsController();
