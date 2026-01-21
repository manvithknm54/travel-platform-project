import { Router } from "express";
import { searchActivities } from "./activity.controller.js";

const router = Router();

// PUBLIC: search activities
router.get("/", searchActivities);

export default router;
