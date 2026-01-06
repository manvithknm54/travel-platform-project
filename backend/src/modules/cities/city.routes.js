import { Router } from "express";
import { searchCities } from "./city.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = Router();

// Read-only but authenticated (can be made public later)
router.use(authMiddleware);

// Search cities
router.get("/", searchCities);

export default router;
