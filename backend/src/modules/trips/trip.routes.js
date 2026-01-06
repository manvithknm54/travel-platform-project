import { Router } from "express";
import {
  createTrip,
  getTrips,
  getTripById,
  deleteTrip,
} from "./trip.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

router.post("/", createTrip);
router.get("/", getTrips);
router.get("/:id", getTripById);
router.delete("/:id", deleteTrip);

export default router;
