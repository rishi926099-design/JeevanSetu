import { Router } from "express";

import verifyJWT from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";

import {
  getPatientDashboard,
  getDoctorDashboard,
  getHospitalAdminDashboard,
  getSuperAdminDashboard,
} from "../controllers/DashboardController.js";

const router = Router();

router.get(
  "/patient",
  verifyJWT,
  authorizeRoles("patient"),
  getPatientDashboard
);

router.get(
  "/doctor",
  verifyJWT,
  authorizeRoles("doctor"),
  getDoctorDashboard
);

router.get(
  "/hospital-admin",
  verifyJWT,
  authorizeRoles("hospitalAdmin"),
  getHospitalAdminDashboard
);

router.get(
  "/super-admin",
  verifyJWT,
  authorizeRoles("superAdmin"),
  getSuperAdminDashboard
);

export default router;