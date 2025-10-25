import express from "express";
import { query, param, body, validationResult } from "express-validator";
import { HostawayService } from "../services/hostaway";
import { HybridReviewsService } from "../services/hybridReviews";
import {
  authenticateToken,
  requireRole,
  AuthRequest,
} from "../middleware/auth";
import ReviewSelection from "../models/ReviewSelection";
import Review from "../models/Review";

const router = express.Router();
const hostawayService = new HostawayService();
const hybridReviewsService = new HybridReviewsService();

router.get(
  "/",
  [
    authenticateToken,
    requireRole(["manager", "admin"]),
    query("listingId").optional().isString(),
    query("source").optional().isIn(["hostaway", "google"]),
    query("rating").optional().isInt({ min: 1, max: 5 }),
    query("channel").optional().isString(),
    query("dateFrom").optional().isISO8601(),
    query("dateTo").optional().isISO8601(),
    query("limit").optional().isInt({ min: 1, max: 100 }),
    query("offset").optional().isInt({ min: 0 }),
  ],
  async (req: AuthRequest, res: express.Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        listingId,
        source,
        rating,
        channel,
        dateFrom,
        dateTo,
        limit = 50,
        offset = 0,
      } = req.query;

      const allReviews = await hybridReviewsService.getAllReviews();

      let filteredReviews = allReviews;

      if (listingId) {
        filteredReviews = filteredReviews.filter(
          (review) => review.listingId === listingId
        );
      }

      if (source) {
        filteredReviews = filteredReviews.filter(
          (review) => review.source === source
        );
      }

      if (rating) {
        filteredReviews = filteredReviews.filter(
          (review) => review.rating === parseInt(rating as string)
        );
      }

      if (channel) {
        filteredReviews = filteredReviews.filter((review) =>
          review.channel
            .toLowerCase()
            .includes((channel as string).toLowerCase())
        );
      }

      if (dateFrom) {
        const fromDate = new Date(dateFrom as string);
        filteredReviews = filteredReviews.filter(
          (review) => new Date(review.reviewDate) >= fromDate
        );
      }

      if (dateTo) {
        const toDate = new Date(dateTo as string);
        filteredReviews = filteredReviews.filter(
          (review) => new Date(review.reviewDate) <= toDate
        );
      }

      const reviewIds = filteredReviews.map((review) => review.id);
      const approvals = await ReviewSelection.find({
        reviewId: { $in: reviewIds },
      });

      const approvalMap = new Map();
      approvals.forEach((approval) => {
        approvalMap.set(approval.reviewId, {
          isApproved: approval.isApproved,
          approvedBy: approval.approvedBy,
          approvedAt: approval.approvedAt,
        });
      });

      const reviewsWithApproval = filteredReviews.map((review) => ({
        ...review,
        approval: approvalMap.get(review.id) || {
          isApproved: false,
          approvedBy: null,
          approvedAt: null,
        },
      }));

      const paginatedReviews = reviewsWithApproval.slice(
        parseInt(offset as string),
        parseInt(offset as string) + parseInt(limit as string)
      );

      res.json({
        reviews: paginatedReviews,
        total: filteredReviews.length,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
        hasMore:
          parseInt(offset as string) + parseInt(limit as string) <
          filteredReviews.length,
      });
    } catch (error) {

      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  }
);

router.get("/test", async (req: express.Request, res: express.Response) => {
  try {
    res.json({
      message: "Reviews service is working",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ error: "Test failed" });
  }
});

router.get(
  "/test-hybrid",
  async (req: express.Request, res: express.Response) => {
    try {

      const { HybridReviewsService } = await import(
        "../services/hybridReviews"
      );
      const hybridService = new HybridReviewsService();
      const reviews = await hybridService.getAllReviews();

      res.json({
        message: "Hybrid service is working",
        totalReviews: reviews.length,
        sampleReviews: reviews.slice(0, 3),
        timestamp: new Date().toISOString(),
      });
    } catch (error) {

      res.status(500).json({
        error: "Hybrid service test failed",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);

router.get(
  "/listing/:listingId",
  [param("listingId").isString().notEmpty()],
  async (req: express.Request, res: express.Response) => {
    try {
      const { listingId } = req.params;
      const { rating, limit = 20, offset = 0 } = req.query;

      const approvals = await ReviewSelection.find({
        propertyId: listingId,
        isApproved: true,
      });

      if (approvals.length > 0) {

        const reviewIds = approvals.map((approval) => approval.reviewId);

        const allReviews = await hybridReviewsService.getAllReviews();

        const approvedReviews = allReviews.filter((review) => {
          return reviewIds.includes(review.id);
        });

        const filteredReviews = approvedReviews.filter((review: any) => {
          if (rating) {
            return review.rating === parseInt(rating as string);
          }
          return true;
        });

        const paginatedReviews = filteredReviews.slice(
          parseInt(offset as string),
          parseInt(offset as string) + parseInt(limit as string)
        );

        const averageRating =
          approvedReviews.reduce(
            (sum: number, review: any) => sum + review.rating,
            0
          ) / approvedReviews.length;

        const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        approvedReviews.forEach((review: any) => {
          ratingDistribution[
            review.rating as keyof typeof ratingDistribution
          ]++;
        });

        return res.json({
          reviews: paginatedReviews,
          total: filteredReviews.length,
          averageRating: averageRating || 0,
          ratingDistribution,
        });
      }

      try {
        const { HybridReviewsService } = await import(
          "../services/hybridReviews"
        );
        const hybridService = new HybridReviewsService();
        const allReviews = await hybridService.getAllReviews();

        const propertyReviews = allReviews.filter((review) => {

          return (
            review.propertyId === listingId ||
            review.listingId === listingId ||
            review.listingId === req.query.hostawayListingId
          );
        });

        if (propertyReviews.length === 0) {
          return res.json({
            reviews: [],
            total: 0,
            averageRating: 0,
            ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
          });
        }

        const formattedReviews = propertyReviews.map((review) => ({
          _id: review.id,
          listingId: review.listingId,
          rating: review.rating,
          reviewText: review.reviewText,
          reviewerName: review.reviewerName,
          reviewDate: review.reviewDate,
          source: review.source,
          channel: review.channel,
        }));

        const filteredReviews = formattedReviews.filter((review) => {
          if (rating) {
            return review.rating === parseInt(rating as string);
          }
          return true;
        });

        const paginatedReviews = filteredReviews.slice(
          parseInt(offset as string),
          parseInt(offset as string) + parseInt(limit as string)
        );

        const averageRating =
          formattedReviews.reduce((sum, review) => sum + review.rating, 0) /
          formattedReviews.length;

        const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        formattedReviews.forEach((review) => {
          ratingDistribution[
            review.rating as keyof typeof ratingDistribution
          ]++;
        });

        return res.json({
          reviews: paginatedReviews,
          total: filteredReviews.length,
          averageRating: averageRating || 0,
          ratingDistribution,
        });
      } catch (hybridError) {

        return res.json({
          reviews: [],
          total: 0,
          averageRating: 0,
          ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        });
      }
    } catch (error) {

      res.status(500).json({ message: "Failed to fetch listing reviews" });
    }
  }
);

router.post(
  "/:reviewId/approve",
  [
    authenticateToken,
    requireRole(["manager", "admin"]),
    param("reviewId").isString().notEmpty(),
    body("propertyId").isString().notEmpty(),
  ],
  async (req: AuthRequest, res: express.Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { reviewId } = req.params;
      const { propertyId, source = "hostaway" } = req.body;

      let reviewSelection = await ReviewSelection.findOne({ reviewId });

      if (reviewSelection) {

        reviewSelection.isApproved = true;
        reviewSelection.approvedBy = req.user!._id as any;
        reviewSelection.approvedAt = new Date();
      } else {

        reviewSelection = new ReviewSelection({
          reviewId,
          source,
          propertyId,
          isApproved: true,
          approvedBy: req.user!._id,
          approvedAt: new Date(),
        });
      }

      await reviewSelection.save();

      res.json({
        message: "Review approved successfully",
        reviewSelection: {
          reviewId: reviewSelection.reviewId,
          isApproved: reviewSelection.isApproved,
          approvedAt: reviewSelection.approvedAt,
        },
      });
    } catch (error) {

      res.status(500).json({ message: "Failed to approve review" });
    }
  }
);

router.delete(
  "/:reviewId/approve",
  [
    authenticateToken,
    requireRole(["manager", "admin"]),
    param("reviewId").isString().notEmpty(),
  ],
  async (req: AuthRequest, res: express.Response) => {
    try {
      const { reviewId } = req.params;

      const reviewSelection = await ReviewSelection.findOne({ reviewId });

      if (!reviewSelection) {
        return res.status(404).json({ message: "Review selection not found" });
      }

      reviewSelection.isApproved = false;
      reviewSelection.approvedBy = req.user!._id as any;
      reviewSelection.approvedAt = new Date();

      await reviewSelection.save();

      res.json({
        message: "Review unapproved successfully",
        reviewSelection: {
          reviewId: reviewSelection.reviewId,
          isApproved: reviewSelection.isApproved,
          approvedAt: reviewSelection.approvedAt,
        },
      });
    } catch (error) {

      res.status(500).json({ message: "Failed to unapprove review" });
    }
  }
);

router.get(
  "/stats/dashboard",
  [authenticateToken, requireRole(["manager", "admin"])],
  async (req: AuthRequest, res: express.Response) => {
    try {

      const allReviews = await hostawayService.fetchReviews(1000, 0);

      const totalReviews = allReviews.length;
      const approvedReviews = await ReviewSelection.countDocuments({
        isApproved: true,
      });
      const pendingReviews = totalReviews - approvedReviews;

      const averageRating =
        totalReviews > 0
          ? allReviews.reduce((sum, review) => sum + review.rating, 0) /
            totalReviews
          : 0;

      const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
      allReviews.forEach((review) => {
        ratingDistribution[review.rating as keyof typeof ratingDistribution]++;
      });

      const channelDistribution: { [key: string]: number } = {};
      allReviews.forEach((review) => {
        channelDistribution[review.channel] =
          (channelDistribution[review.channel] || 0) + 1;
      });

      const listingStats: {
        [key: string]: { count: number; avgRating: number };
      } = {};
      allReviews.forEach((review) => {
        if (!listingStats[review.listingId]) {
          listingStats[review.listingId] = { count: 0, avgRating: 0 };
        }
        listingStats[review.listingId].count++;
        listingStats[review.listingId].avgRating += review.rating;
      });

      Object.keys(listingStats).forEach((listingId) => {
        const stats = listingStats[listingId];
        stats.avgRating = Math.round((stats.avgRating / stats.count) * 10) / 10;
      });

      res.json({
        totalReviews,
        approvedReviews,
        pendingReviews,
        averageRating: Math.round(averageRating * 10) / 10,
        ratingDistribution,
        channelDistribution,
        listingStats,
      });
    } catch (error) {

      res.status(500).json({ message: "Failed to fetch dashboard statistics" });
    }
  }
);

router.post(
  "/refresh",
  [authenticateToken, requireRole(["manager", "admin"])],
  async (req: AuthRequest, res: express.Response) => {
    try {
      const reviews = await hostawayService.fetchReviews(1000, 0);

      res.json({
        message: "Reviews refreshed successfully",
        count: reviews.length,
        lastUpdated: new Date().toISOString(),
      });
    } catch (error) {

      res.status(500).json({ message: "Failed to refresh reviews" });
    }
  }
);

router.get(
  "/hostaway",
  [authenticateToken, requireRole(["manager", "admin"])],
  async (req: AuthRequest, res: express.Response) => {
    try {

      const hostawayReviews = await hostawayService.fetchReviews(1000, 0);

      res.json({
        success: true,
        data: hostawayReviews,
        count: hostawayReviews.length,
        source: "hostaway",
        lastUpdated: new Date().toISOString(),
      });
    } catch (error) {

      res.status(500).json({
        success: false,
        message: "Failed to fetch Hostaway reviews",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);

router.get(
  "/hybrid",
  [authenticateToken, requireRole(["manager", "admin"])],
  async (req: AuthRequest, res: express.Response) => {
    try {

      const hybridReviews = await hybridReviewsService.getAllReviews();

      res.json({
        success: true,
        data: hybridReviews,
        count: hybridReviews.length,
        source: "hybrid",
        lastUpdated: new Date().toISOString(),
      });
    } catch (error) {

      res.status(500).json({
        success: false,
        message: "Failed to fetch hybrid reviews",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);

router.get(
  "/stats",
  [authenticateToken, requireRole(["manager", "admin"])],
  async (req: AuthRequest, res: express.Response) => {
    try {

      const stats = await hybridReviewsService.getReviewsStats();

      const approvedReviews = await ReviewSelection.find({ isApproved: true });
      const approvedCount = approvedReviews.length;
      const pendingCount = Math.max(0, stats.totalReviews - approvedCount);

      const channelDistribution = {
        hostaway: stats.hostawayReviews,
        google: stats.googleReviews,
      };

      const listingStats: {
        [key: string]: { count: number; avgRating: number };
      } = {};
      Object.entries(stats.reviewsByProperty).forEach(([propertyId, count]) => {
        listingStats[propertyId] = {
          count,
          avgRating: stats.averageRating,
        };
      });

      res.json({
        success: true,
        data: {
          totalReviews: stats.totalReviews,
          approvedReviews: approvedCount,
          pendingReviews: pendingCount,
          averageRating: stats.averageRating,
          hostawayReviews: stats.hostawayReviews,
          googleReviews: stats.googleReviews,
          ratingDistribution: stats.ratingDistribution,
          channelDistribution,
          listingStats,
          lastUpdated: new Date().toISOString(),
        },
      });
    } catch (error) {

      res.status(500).json({
        success: false,
        message: "Failed to fetch dashboard statistics",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);

export default router;
