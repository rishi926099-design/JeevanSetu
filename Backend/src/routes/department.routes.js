import { Router } from "express";

import verifyJWT from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";

import {
  createDepartment,
  getAllDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
} from "../controllers/DepartmentController.js";

const router = Router();

// CREATE
router.post(
  "/",
  verifyJWT,
  authorizeRoles("hospitalAdmin", "superAdmin"),
  createDepartment
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
  getAllDepartments
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
  getDepartmentById
);

// UPDATE
router.patch(
  "/:id",
  verifyJWT,
  authorizeRoles("hospitalAdmin", "superAdmin"),
  updateDepartment
);

// DELETE
router.delete(
  "/:id",
  verifyJWT,
  authorizeRoles("hospitalAdmin", "superAdmin"),
  deleteDepartment
);

export default router;