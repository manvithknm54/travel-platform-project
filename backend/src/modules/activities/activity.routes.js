import { Router } from "express";
import { searchActivities } from "./activity.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = Router();

// Read-only but authenticated
router.use(authMiddleware);

// Search activities
router.get("/", searchActivities);

export default router;
