import express from "express";

import {
  createPrescription,
  getAllPrescriptions,
  getPrescriptionById,
  getPrescriptionsByPatient,
  updatePrescription,
  deletePrescription,
} from "../controllers/PrescriptionController.js";

import verifyJWT from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";

const router = express.Router();

// Create Prescription
router.post(
  "/",
  verifyJWT,
  authorizeRoles("doctor", "hospitalAdmin", "superAdmin"),
  createPrescription
);

// Get All Prescriptions
router.get(
  "/",
  verifyJWT,
  authorizeRoles("patient", "doctor", "hospitalAdmin", "superAdmin"),
  getAllPrescriptions
);

// Get Prescriptions by Patient
router.get(
  "/patient/:patientId",
  verifyJWT,
  authorizeRoles("patient", "doctor", "hospitalAdmin", "superAdmin"),
  getPrescriptionsByPatient
);

// Get Prescription by ID
router.get(
  "/:id",
  verifyJWT,
  authorizeRoles("patient", "doctor", "hospitalAdmin", "superAdmin"),
  getPrescriptionById
);

// Update Prescription
router.patch(
  "/:id",
  verifyJWT,
  authorizeRoles("doctor", "hospitalAdmin", "superAdmin"),
  updatePrescription
);

// Delete Prescription
router.delete(
  "/:id",
  verifyJWT,
  authorizeRoles("doctor", "hospitalAdmin", "superAdmin"),
  deletePrescription
);

export default router;