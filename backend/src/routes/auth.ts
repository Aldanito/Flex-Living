import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import User from "../models/User";
import { AuthRequest, authenticateToken } from "../middleware/auth";

const router = express.Router();

router.post(
  "/register",
  [
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 6 }),
    body("role").optional().isIn(["manager", "admin"]),
  ],
  async (req: express.Request, res: express.Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password, role = "manager" } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const user = new User({
        email,
        password: hashedPassword,
        role,
      });

      await user.save();

      res.status(201).json({
        message: "User created successfully",
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {

      res.status(500).json({ message: "Internal server error" });
    }
  }
);

router.post(
  "/login",
  [body("email").isEmail().normalizeEmail(), body("password").exists()],
  async (req: express.Request, res: express.Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const accessToken = jwt.sign(
        { userId: (user._id as any).toString() },
        process.env.JWT_SECRET!,
        { expiresIn: (15 * 60) as any }
      );

      const refreshToken = jwt.sign(
        { userId: (user._id as any).toString() },
        process.env.JWT_REFRESH_SECRET!,
        { expiresIn: (7 * 24 * 60 * 60) as any }
      );

      res.json({
        message: "Login successful",
        accessToken,
        refreshToken,
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {

      res.status(500).json({ message: "Internal server error" });
    }
  }
);

router.post("/refresh", async (req: express.Request, res: express.Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token required" });
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET!
    ) as any;

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const newAccessToken = jwt.sign(
      { userId: (user._id as any).toString() },
      process.env.JWT_SECRET!,
      { expiresIn: (15 * 60) as any }
    );

    res.json({
      accessToken: newAccessToken,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {

    res.status(401).json({ message: "Invalid refresh token" });
  }
});

router.get(
  "/me",
  authenticateToken,
  async (req: AuthRequest, res: express.Response) => {
    try {
      if (!req.user || !req.user._id) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const user = await User.findById(req.user._id).select("-password");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {

      res.status(500).json({ message: "Internal server error" });
    }
  }
);

export default router;
