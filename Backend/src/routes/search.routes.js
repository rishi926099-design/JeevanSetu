import { Router } from "express";

import verifyJWT from "../middleware/authMiddleware.js";

import {
  searchDoctors,
  searchHospitals,
  searchDepartments,
  searchSpecializations,
} from "../controllers/SearchController.js";

const router = Router();

router.get(
  "/doctors",
  verifyJWT,
  searchDoctors
);

router.get(
  "/hospitals",
  verifyJWT,
  searchHospitals
);

router.get(
  "/departments",
  verifyJWT,
  searchDepartments
);

router.get(
  "/specializations",
  verifyJWT,
  searchSpecializations
);

export default router;