import { Router } from "express";
import propertiesController from "../controllers/properties.controller";
import { authenticateToken } from "../middleware/auth";

const router = Router();

// Public routes (no authentication required)
router.get("/public", propertiesController.getPublicProperties);
router.get("/:id", propertiesController.getProperty);

// Admin routes (authentication required)
router.get(
  "/",
  authenticateToken,
  propertiesController.getProperties.bind(propertiesController)
);
router.get(
  "/admin/:id",
  authenticateToken,
  propertiesController.getAdminProperty.bind(propertiesController)
);
router.get(
  "/name/:name",
  authenticateToken,
  propertiesController.getPropertyByName.bind(propertiesController)
);
router.post(
  "/",
  authenticateToken,
  propertiesController.createProperty.bind(propertiesController)
);
router.put(
  "/:id",
  authenticateToken,
  propertiesController.updateProperty.bind(propertiesController)
);
router.delete(
  "/:id",
  authenticateToken,
  propertiesController.deleteProperty.bind(propertiesController)
);

// Hostaway sync and approval routes (admin only)
router.post(
  "/sync",
  authenticateToken,
  propertiesController.syncHostawayListings.bind(propertiesController)
);
router.post(
  "/:id/approve",
  authenticateToken,
  propertiesController.approveProperty.bind(propertiesController)
);
router.post(
  "/:id/reject",
  authenticateToken,
  propertiesController.rejectProperty.bind(propertiesController)
);

export default router;
