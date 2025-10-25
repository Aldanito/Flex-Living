import { Router, Request, Response } from "express";

const router = Router();

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (username === "admin" && password === "admin123") {
      res.json({
        success: true,
        message: "Login successful",
        data: {
          user: {
            id: 1,
            username: "admin",
            role: "manager",
          },
          token: "demo-token-123",
        },
      });
    } else {
      res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }
  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

router.get("/verify", async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (token === "demo-token-123") {
      res.json({
        success: true,
        data: {
          user: {
            id: 1,
            username: "admin",
            role: "manager",
          },
        },
      });
    } else {
      res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }
  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Token verification failed",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
