// Load environment variables first
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
// Rate limiting removed for development
import { connectDB } from "./utils/database";
import authRoutes from "./routes/auth";
import reviewRoutes from "./routes/reviews";
import googleRoutes from "./routes/google";
import propertiesRoutes from "./routes/properties.routes";

// Debug: Check if environment variables are loaded
console.log("Environment variables loaded:");
console.log(
  "GOOGLE_PLACES_API_KEY:",
  process.env.GOOGLE_PLACES_API_KEY ? "YES" : "NO"
);
console.log(
  "HOSTAWAY_ACCOUNT_ID:",
  process.env.HOSTAWAY_ACCOUNT_ID ? "YES" : "NO"
);
console.log("HOSTAWAY_API_KEY:", process.env.HOSTAWAY_API_KEY ? "YES" : "NO");

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// Rate limiting removed for development

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow all origins in development
      if (process.env.NODE_ENV !== "production") {
        return callback(null, true);
      }

      // In production, only allow specific origins
      const allowedOrigins = ["https://your-frontend-domain.com"];

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

// Handle preflight requests
app.options("*", cors());

// Logging
app.use(morgan("combined"));

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// API routes
// Health check endpoint
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

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Global error handler:", err);

    if (err.type === "entity.parse.failed") {
      return res.status(400).json({ message: "Invalid JSON in request body" });
    }

    res.status(500).json({
      message: "Internal server error",
      ...(process.env.NODE_ENV === "development" && { error: err.message }),
    });
  }
);

// Start server
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully");
  process.exit(0);
});

startServer();
