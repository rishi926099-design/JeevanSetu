import { Router } from "express";

import verifyJWT from "../middleware/authMiddleware.js";

import {
  register,
  login,
  refreshAccessToken,
  getCurrentUser,
  logout,
  changePassword,
  createSuperAdmin,
} from "../controllers/AuthController.js";

const router = Router();

// Register
router.post(
  "/register",
  register
);

// Login
router.post(
  "/login",
  login
);

// Refresh Access Token
router.post(
  "/refresh-token",
  refreshAccessToken
);

// Current Logged-in User
router.get(
  "/me",
  verifyJWT,
  getCurrentUser
);

// Logout
router.post(
  "/logout",
  verifyJWT,
  logout
);

// Change Password
router.patch(
  "/change-password",
  verifyJWT,
  changePassword
);

router.post(
  "/create-super-admin",
  createSuperAdmin
);

export default router;