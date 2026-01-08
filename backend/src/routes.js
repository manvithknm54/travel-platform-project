import { Router } from "express";

import authRoutes from "./modules/auth/auth.routes.js";
import tripRoutes from "./modules/trips/trip.routes.js";
import itineraryRoutes from "./modules/itinerary/itinerary.routes.js";
import cityRoutes from "./modules/cities/city.routes.js";
import activityRoutes from "./modules/activities/activity.routes.js";
import budgetRoutes from "./modules/budgets/budget.routes.js";
import shareRoutes from "./modules/sharing/share.routes.js";
import userRoutes from "./modules/users/user.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes); // 👈 NEW (PROFILE SETTINGS)
router.use("/trips", tripRoutes);
router.use("/itinerary", itineraryRoutes);
router.use("/cities", cityRoutes);
router.use("/activities", activityRoutes);
router.use("/budgets", budgetRoutes);
router.use("/shares", shareRoutes);

export default router;
