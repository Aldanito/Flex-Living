
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { connectDB } from "./utils/database";
import authRoutes from "./routes/auth";
import reviewRoutes from "./routes/reviews";
import googleRoutes from "./routes/google";
import propertiesRoutes from "./routes/properties.routes";

const app = express();
const PORT = parseInt(process.env.PORT || "5000", 10);

app.use(helmet());

app.use(
  cors({
    origin: (origin, callback) => {

      if (process.env.NODE_ENV !== "production") {
        return callback(null, true);
      }

      const allowedOrigins = [
        "https://flex-living-frontend.up.railway.app",
        "https://flexfrontend-production-4ad0.up.railway.app",
        "http://localhost:5173",
        "http://localhost:3000",
      ];

      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    optionsSuccessStatus: 200,
  })
);

app.options("*", cors());

app.use(morgan("combined"));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/google", googleRoutes);
app.use("/api/properties", propertiesRoutes);

app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {

    if (err.type === "entity.parse.failed") {
      return res.status(400).json({ message: "Invalid JSON in request body" });
    }

    res.status(500).json({
      message: "Internal server error",
      ...(process.env.NODE_ENV === "development" && { error: err.message }),
    });
  }
);

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, "0.0.0.0", () => {

    });
  } catch (error) {

    process.exit(1);
  }
};

process.on("SIGTERM", () => {

  process.exit(0);
});

process.on("SIGINT", () => {

  process.exit(0);
});

startServer();
