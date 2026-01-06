import { Router } from "express";
import {
  addStop,
  addActivityToStop,
  getItinerary,
} from "./itinerary.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = Router({ mergeParams: true });

// All routes require authentication
router.use(authMiddleware);

// Add a city stop to a trip
router.post("/trip/:tripId/stops", addStop);

// Add activity to a stop
router.post("/stops/:stopId/activities", addActivityToStop);

// Get full itinerary of a trip
router.get("/trip/:tripId", getItinerary);

export default router;
