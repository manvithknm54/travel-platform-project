import { Router } from "express";
import {
  createShareLink,
  getPublicTrip,
} from "./share.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = Router();

// Create share link (private)
router.post("/trip/:tripId", authMiddleware, createShareLink);

// Public access
router.get("/public/:token", getPublicTrip);

export default router;
