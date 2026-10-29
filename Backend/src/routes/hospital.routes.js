import express from "express";

import verifyJWT from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";

import {
  createHospital,
  getAllHospitals,
  getHospitalById,
  updateHospital,
  deleteHospital,
} from "../controllers/HospitalController.js";

const router = express.Router();

// Get all hospitals
router.get(
  "/",
  verifyJWT,
  authorizeRoles(
    "patient",
    "doctor",
    "hospitalAdmin",
    "superAdmin"
  ),
  getAllHospitals
);

// Get hospital by ID
router.get(
  "/:id",
  verifyJWT,
  authorizeRoles(
    "patient",
    "doctor",
    "hospitalAdmin",
    "superAdmin"
  ),
  getHospitalById
);

// Create hospital
router.post(
  "/",
  verifyJWT,
  authorizeRoles("superAdmin"),
  createHospital
);

// Update hospital
router.patch(
  "/:id",
  verifyJWT,
  authorizeRoles("superAdmin", "hospitalAdmin"),
  updateHospital
);

// Soft delete hospital
router.delete(
  "/:id",
  verifyJWT,
  authorizeRoles("superAdmin"),
  deleteHospital
);

export default router;