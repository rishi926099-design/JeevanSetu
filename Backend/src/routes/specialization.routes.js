import { Router } from "express";

import verifyJWT from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";

import {
  createSpecialization,
  getAllSpecializations,
  getSpecializationById,
  updateSpecialization,
  deleteSpecialization,
} from "../controllers/SpecializationController.js";

const router = Router();

router.post(
  "/",
  verifyJWT,
  authorizeRoles("hospitalAdmin", "superAdmin"),
  createSpecialization
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
  getAllSpecializations
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
  getSpecializationById
);

router.patch(
  "/:id",
  verifyJWT,
  authorizeRoles("hospitalAdmin", "superAdmin"),
  updateSpecialization
);

router.delete(
  "/:id",
  verifyJWT,
  authorizeRoles("hospitalAdmin", "superAdmin"),
  deleteSpecialization
);

export default router;