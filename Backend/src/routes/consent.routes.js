import { Router } from "express";

import verifyJWT from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";

import {
  createConsent,
  getAllConsents,
  getConsentById,
  getConsentsByPatient,
  updateConsent,
  revokeConsent,
  deleteConsent,
} from "../controllers/ConsentController.js";

const router = Router();

// Create Consent
router.post(
  "/",
  verifyJWT,
  authorizeRoles("patient", "doctor", "hospitalAdmin", "superAdmin"),
  createConsent
);

// Get All Consents
router.get(
  "/",
  verifyJWT,
  authorizeRoles("patient", "doctor", "hospitalAdmin", "superAdmin"),
  getAllConsents
);

// Get Consents by Patient
router.get(
  "/patient/:patientId",
  verifyJWT,
  authorizeRoles("patient", "doctor", "hospitalAdmin", "superAdmin"),
  getConsentsByPatient
);

// Get Consent by ID
router.get(
  "/:id",
  verifyJWT,
  authorizeRoles("patient", "doctor", "hospitalAdmin", "superAdmin"),
  getConsentById
);

// Update Consent
router.patch(
  "/:id",
  verifyJWT,
  authorizeRoles("patient", "doctor", "hospitalAdmin", "superAdmin"),
  updateConsent
);

// Revoke Consent
router.patch(
  "/:id/revoke",
  verifyJWT,
  authorizeRoles("patient", "doctor", "hospitalAdmin", "superAdmin"),
  revokeConsent
);

// Delete Consent
router.delete(
  "/:id",
  verifyJWT,
  authorizeRoles("patient", "superAdmin"),
  deleteConsent
);

export default router;