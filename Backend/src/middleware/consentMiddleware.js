import mongoose from "mongoose";

import { Consent } from "../models/Consent.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

const checkConsent = asyncHandler(async (req, res, next) => {
  const patientId =
    req.params.patientId ||
    req.body.patient ||
    req.query.patientId;

  if (!patientId) {
    throw new ApiError(
      400,
      "Patient ID is required to verify consent"
    );
  }

  if (!mongoose.Types.ObjectId.isValid(patientId)) {
    throw new ApiError(400, "Invalid patient ID");
  }

  // Patient accessing their own records
  if (
    req.user.role === "patient" &&
    req.user.profileId.toString() === patientId.toString()
  ) {
    req.consent = {
      bypass: true,
      reason: "Patient accessing own records",
    };

    return next();
  }

  // Hospital Admin / Super Admin
  // can continue for administrative operations.
  if (
    req.user.role === "hospitalAdmin" ||
    req.user.role === "superAdmin"
  ) {
    req.consent = {
      bypass: true,
      reason: "Administrative access",
    };

    return next();
  }

  // Doctor access requires approved consent
  if (req.user.role !== "doctor") {
    throw new ApiError(
      403,
      "You do not have permission to access this patient's records"
    );
  }

  const consent = await Consent.findOne({
    patient: patientId,
    grantedToDoctor: req.user.profileId,
    status: "Approved",
    $or: [
      { expiresAt: null },
      { expiresAt: { $gt: new Date() } },
    ],
  }).sort({ grantedAt: -1 });

  if (!consent) {
    throw new ApiError(
      403,
      "Valid patient consent is required to access this patient's records"
    );
  }

  // Check access level
  if (
    consent.accessLevel !== "Read" &&
    consent.accessLevel !== "Read & Download" &&
    consent.accessLevel !== "Full Access"
  ) {
    throw new ApiError(
      403,
      "Your consent access level does not allow this operation"
    );
  }

  req.consent = consent;

  next();
});

export default checkConsent;