import { Router } from "express";
import reviewsController from "../controllers/reviews.controller";

const router = Router();

router.get("/hostaway", reviewsController.fetchHostawayReviews);
router.get("/google", reviewsController.fetchGoogleReviews);
router.get("/sync", reviewsController.syncAllReviews);

router.get("/", reviewsController.getReviews);
router.get("/public", reviewsController.getPublicReviews);
router.patch("/:id/status", reviewsController.updateReviewStatus);
router.patch("/:id/public", reviewsController.toggleReviewPublic);

router.get("/analytics/stats", reviewsController.getDashboardStats);

export default router;
