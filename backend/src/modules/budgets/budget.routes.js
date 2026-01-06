import { Router } from "express";
import { getTripBudget } from "./budget.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

// Get budget summary for a trip
router.get("/trip/:tripId", getTripBudget);

export default router;
