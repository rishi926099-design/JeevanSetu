import { Router } from "express";

import verifyJWT from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";

import {
  createNotification,
  getMyNotifications,
  getNotificationById,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "../controllers/NotificationController.js";

const router = Router();

// CREATE
router.post(
  "/",
  verifyJWT,
  authorizeRoles("hospitalAdmin", "superAdmin"),
  createNotification
);

// GET MY NOTIFICATIONS
router.get(
  "/",
  verifyJWT,
  authorizeRoles(
    "patient",
    "doctor",
    "hospitalAdmin",
    "superAdmin"
  ),
  getMyNotifications
);

// GET BY ID
router.get(
  "/:id",
  verifyJWT,
  authorizeRoles(
    "patient",
    "doctor",
    "hospitalAdmin",
    "superAdmin"
  ),
  getNotificationById
);

// MARK AS READ
router.patch(
  "/:id/read",
  verifyJWT,
  authorizeRoles(
    "patient",
    "doctor",
    "hospitalAdmin",
    "superAdmin"
  ),
  markNotificationAsRead
);

// MARK ALL AS READ
router.patch(
  "/read-all",
  verifyJWT,
  authorizeRoles(
    "patient",
    "doctor",
    "hospitalAdmin",
    "superAdmin"
  ),
  markAllNotificationsAsRead
);

// DELETE
router.delete(
  "/:id",
  verifyJWT,
  authorizeRoles(
    "patient",
    "doctor",
    "hospitalAdmin",
    "superAdmin"
  ),
  deleteNotification
);

export default router;