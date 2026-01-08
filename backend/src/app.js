import express from "express";
import cors from "cors";
import healthRoutes from "./routes/health.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import routes from "./routes.js";

const app = express();

/* Middlewares */
app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));


/* Routes */
app.use("/api/health", healthRoutes);

/* Error handler (must be last) */
app.use(errorHandler);

app.use("/api", routes);
export default app;
