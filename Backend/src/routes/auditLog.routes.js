import { Router } from "express";

import verifyJWT from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";

import {
  getAllAuditLogs,
  getAuditLogById,
  getAuditLogsByPatient,
  getAuditLogsByUser,
} from "../controllers/AuditLogController.js";

const router = Router();

// Get All Audit Logs
// Only Hospital Admin and Super Admin
router.get(
  "/",
  verifyJWT,
  authorizeRoles("hospitalAdmin", "superAdmin"),
  getAllAuditLogs
);

// Get Audit Logs by Patient
// Only Hospital Admin and Super Admin
router.get(
  "/patient/:patientId",
  verifyJWT,
  authorizeRoles("hospitalAdmin", "superAdmin"),
  getAuditLogsByPatient
);

// Get Audit Logs by User
// Only Hospital Admin and Super Admin
router.get(
  "/user/:userId",
  verifyJWT,
  authorizeRoles("hospitalAdmin", "superAdmin"),
  getAuditLogsByUser
);

// Get Audit Log by ID
// Only Hospital Admin and Super Admin
router.get(
  "/:id",
  verifyJWT,
  authorizeRoles("hospitalAdmin", "superAdmin"),
  getAuditLogById
);

export default router;