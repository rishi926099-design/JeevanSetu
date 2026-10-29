import { Router } from "express";

import verifyJWT from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";

import {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointment,
  cancelAppointment,
  deleteAppointment,
} from "../controllers/AppointmentController.js";

const router = Router();

// CREATE
router.post(
  "/",
  verifyJWT,
  authorizeRoles(
    "patient",
    "doctor",
    "hospitalAdmin",
    "superAdmin"
  ),
  createAppointment
);

// GET ALL
router.get(
  "/",
  verifyJWT,
  authorizeRoles(
    "patient",
    "doctor",
    "hospitalAdmin",
    "superAdmin"
  ),
  getAllAppointments
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
  getAppointmentById
);

// UPDATE
router.patch(
  "/:id",
  verifyJWT,
  authorizeRoles(
    "patient",
    "doctor",
    "hospitalAdmin",
    "superAdmin"
  ),
  updateAppointment
);

// CANCEL
router.patch(
  "/:id/cancel",
  verifyJWT,
  authorizeRoles(
    "patient",
    "doctor",
    "hospitalAdmin",
    "superAdmin"
  ),
  cancelAppointment
);

// DELETE
router.delete(
  "/:id",
  verifyJWT,
  authorizeRoles("hospitalAdmin", "superAdmin"),
  deleteAppointment
);

export default router;