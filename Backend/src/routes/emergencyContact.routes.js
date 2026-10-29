import { Router } from "express";

import verifyJWT from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";

import {
  createEmergencyContact,
  getAllEmergencyContacts,
  getEmergencyContactById,
  getEmergencyContactsByPatient,
  updateEmergencyContact,
  deleteEmergencyContact,
} from "../controllers/EmergencyContactController.js";

const router = Router();

router.post(
  "/",
  verifyJWT,
  authorizeRoles("patient", "hospitalAdmin", "superAdmin"),
  createEmergencyContact
);

router.get(
  "/",
  verifyJWT,
  authorizeRoles(
    "patient",
    "doctor",
    "hospitalAdmin",
    "superAdmin"
  ),
  getAllEmergencyContacts
);

router.get(
  "/patient/:patientId",
  verifyJWT,
  authorizeRoles(
    "patient",
    "doctor",
    "hospitalAdmin",
    "superAdmin"
  ),
  getEmergencyContactsByPatient
);

router.get(
  "/:id",
  verifyJWT,
  authorizeRoles(
    "patient",
    "doctor",
    "hospitalAdmin",
    "superAdmin"
  ),
  getEmergencyContactById
);

router.patch(
  "/:id",
  verifyJWT,
  authorizeRoles("patient", "hospitalAdmin", "superAdmin"),
  updateEmergencyContact
);

router.delete(
  "/:id",
  verifyJWT,
  authorizeRoles("patient", "hospitalAdmin", "superAdmin"),
  deleteEmergencyContact
);

export default router;