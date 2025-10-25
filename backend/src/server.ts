import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import connectDB from "./config/database";
import corsMiddleware from "./middleware/cors";

import authRoutes from "./routes/auth.routes";
import reviewsRoutes from "./routes/reviews.routes";
import propertiesRoutes from "./routes/properties.routes";

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || "5000", 10);

connectDB();

app.use(helmet());
app.use(morgan("combined"));
app.use(corsMiddleware);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Flex Living Reviews API is running",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/reviews", reviewsRoutes);
app.use("/api/properties", propertiesRoutes);

app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {

    res.status(500).json({
      success: false,
      message: "Internal server error",
      error:
        process.env.NODE_ENV === "development"
          ? err.message
          : "Something went wrong",
    });
  }
);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.listen(PORT, "0.0.0.0", () => {

});

export default app;
