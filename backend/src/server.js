import app from "./app.js";
import { ENV } from "./config/env.js";
import cors from "cors";


app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.listen(ENV.PORT, () => {
  console.log(`Backend running on port ${ENV.PORT}`);
});

app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err);

  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});
