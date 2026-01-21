import { Router } from "express";
import { searchCities } from "./city.controller.js";

const router = Router();

router.get("/", searchCities);

export default router;
