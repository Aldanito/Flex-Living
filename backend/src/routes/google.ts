import express from "express";
import { query, param, validationResult } from "express-validator";
import { GooglePlacesService } from "../services/googlePlaces";
import {
  authenticateToken,
  requireRole,
  AuthRequest,
} from "../middleware/auth";

const router = express.Router();
const googlePlacesService = new GooglePlacesService();

// Test Google Places API connection
router.get(
  "/test",
  [authenticateToken, requireRole(["manager", "admin"])],
  async (req: AuthRequest, res: express.Response) => {
    try {
      const result = await googlePlacesService.testConnection();

      res.json({
        ...result,
      });
    } catch (error) {
      console.error("Error testing Google Places API:", error);
      res.status(500).json({
        message: "Failed to test Google Places API",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);

// Search for places
router.get(
  "/search",
  [
    authenticateToken,
    requireRole(["manager", "admin"]),
    query("query").isString().notEmpty(),
  ],
  async (req: AuthRequest, res: express.Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { query: searchQuery } = req.query;
      const places = await googlePlacesService.searchPlaces(
        searchQuery as string
      );

      res.json({
        message: "Places search completed",
        query: searchQuery,
        results: places,
        count: places.length,
      });
    } catch (error) {
      console.error("Error searching places:", error);
      res.status(500).json({
        message: "Failed to search places",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);

// Get place details including reviews
router.get(
  "/place/:placeId",
  [
    authenticateToken,
    requireRole(["manager", "admin"]),
    param("placeId").isString().notEmpty(),
  ],
  async (req: AuthRequest, res: express.Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { placeId } = req.params;
      const placeDetails = await googlePlacesService.getPlaceDetails(placeId);

      if (!placeDetails) {
        return res.status(404).json({ message: "Place not found" });
      }

      // Convert reviews to our normalized format
      const reviews = googlePlacesService.normalizeReviews(
        placeDetails,
        `google_${placeId}`
      );

      res.json({
        message: "Place details retrieved successfully",
        place: {
          placeId: placeDetails.place_id,
          name: placeDetails.name,
          rating: placeDetails.rating,
          totalRatings: placeDetails.user_ratings_total,
          address: placeDetails.formatted_address,
          location: placeDetails.geometry.location,
        },
        reviews,
        reviewCount: reviews.length,
      });
    } catch (error) {
      console.error("Error fetching place details:", error);
      res.status(500).json({
        message: "Failed to fetch place details",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);

// Search for Flex Living reviews
router.get(
  "/flex-living-reviews",
  [authenticateToken, requireRole(["manager", "admin"])],
  async (req: AuthRequest, res: express.Response) => {
    try {
      console.log("Searching for Flex Living reviews on Google Places...");

      const reviews = await googlePlacesService.searchFlexLivingReviews();

      res.json({
        message: "Flex Living Google reviews search completed",
        reviews,
        count: reviews.length,
        searchTimestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error searching Flex Living reviews:", error);

      // If API fails, return empty array
      console.log("No Google reviews available due to API error");
      res.json({
        message: "Flex Living Google reviews search completed",
        reviews: [],
        count: 0,
        searchTimestamp: new Date().toISOString(),
        note: "No reviews available",
      });
    }
  }
);

export default router;
