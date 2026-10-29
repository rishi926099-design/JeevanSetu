import { Router } from "express";

import verifyJWT from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";
import checkConsent from "../middleware/consentMiddleware.js";
import checkResourceAccess from "../middleware/resourceAuthorizationMiddleware.js";

import {
  createMedicalRecord,
  getAllMedicalRecords,
  getMedicalRecordById,
  updateMedicalRecord,
  deleteMedicalRecord,
} from "../controllers/MedicalRecordController.js";

const router = Router();

// ==========================================
// CREATE MEDICAL RECORD
// ==========================================

router.post(
  "/",
  verifyJWT,
  authorizeRoles("doctor", "hospitalAdmin", "superAdmin"),
  checkConsent,
  createMedicalRecord
);

// ==========================================
// GET ALL MEDICAL RECORDS
// ==========================================

router.get(
  "/",
  verifyJWT,
  authorizeRoles(
    "patient",
    "doctor",
    "hospitalAdmin",
    "superAdmin"
  ),
  getAllMedicalRecords
);

// ==========================================
// GET MEDICAL RECORD BY ID
// ==========================================

router.get(
  "/:id",
  verifyJWT,
  authorizeRoles(
    "patient",
    "doctor",
    "hospitalAdmin",
    "superAdmin"
  ),
  checkResourceAccess("MedicalRecord"),
  getMedicalRecordById
);

// ==========================================
// UPDATE MEDICAL RECORD
// ==========================================

router.patch(
  "/:id",
  verifyJWT,
  authorizeRoles(
    "doctor",
    "hospitalAdmin",
    "superAdmin"
  ),
  checkResourceAccess("MedicalRecord"),
  updateMedicalRecord
);

// ==========================================
// DELETE MEDICAL RECORD
// ==========================================

router.delete(
  "/:id",
  verifyJWT,
  authorizeRoles(
    "doctor",
    "hospitalAdmin",
    "superAdmin"
  ),
  checkResourceAccess("MedicalRecord"),
  deleteMedicalRecord
);

export default router;