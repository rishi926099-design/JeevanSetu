import { Router } from "express";

import verifyJWT from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";

import {
  createReferral,
  getAllReferrals,
  getReferralById,
  getReferralsByPatient,
  updateReferral,
  deleteReferral,
} from "../controllers/ReferralController.js";

const router = Router();

// Create Referral
router.post(
  "/",
  verifyJWT,
  authorizeRoles("doctor", "hospitalAdmin", "superAdmin"),
  createReferral
);

// Get All Referrals
router.get(
  "/",
  verifyJWT,
  authorizeRoles("patient", "doctor", "hospitalAdmin", "superAdmin"),
  getAllReferrals
);

// Get Referrals by Patient
router.get(
  "/patient/:patientId",
  verifyJWT,
  authorizeRoles("patient", "doctor", "hospitalAdmin", "superAdmin"),
  getReferralsByPatient
);

// Get Referral by ID
router.get(
  "/:id",
  verifyJWT,
  authorizeRoles("patient", "doctor", "hospitalAdmin", "superAdmin"),
  getReferralById
);

// Update Referral
router.patch(
  "/:id",
  verifyJWT,
  authorizeRoles("doctor", "hospitalAdmin", "superAdmin"),
  updateReferral
);

// Delete Referral
router.delete(
  "/:id",
  verifyJWT,
  authorizeRoles("doctor", "hospitalAdmin", "superAdmin"),
  deleteReferral
);

export default router;