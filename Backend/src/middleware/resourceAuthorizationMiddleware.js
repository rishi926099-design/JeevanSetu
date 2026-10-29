import mongoose from "mongoose";

import { MedicalRecord } from "../models/MedicalRecord.js";
import { Prescription } from "../models/Prescription.js";
import { Referral } from "../models/Referral.js";

import { Consent } from "../models/Consent.js";

import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

const checkResourceAccess = (resourceType) =>
  asyncHandler(async (req, res, next) => {
    const resourceId = req.params.id;

    if (!resourceId) {
      throw new ApiError(400, "Resource ID is required");
    }

    if (!mongoose.Types.ObjectId.isValid(resourceId)) {
      throw new ApiError(400, "Invalid resource ID");
    }

    let resource;
    let patientId;

    // -----------------------------------
    // Find Resource
    // -----------------------------------

    switch (resourceType) {
      case "MedicalRecord":
        resource = await MedicalRecord.findById(resourceId);
        break;

      case "Prescription":
        resource = await Prescription.findById(resourceId);
        break;

      case "Referral":
        resource = await Referral.findById(resourceId);
        break;

      default:
        throw new ApiError(500, "Invalid resource type");
    }

    if (!resource) {
      throw new ApiError(
        404,
        `${resourceType} not found`
      );
    }

    patientId = resource.patient;

    if (!patientId) {
      throw new ApiError(
        400,
        "Patient information is missing from this resource"
      );
    }

    // -----------------------------------
    // Patient Access
    // -----------------------------------

    if (req.user.role === "patient") {
      if (
        req.user.profileId.toString() !==
        patientId.toString()
      ) {
        throw new ApiError(
          403,
          "You can only access your own medical records"
        );
      }

      req.resource = resource;
      req.patientId = patientId;

      return next();
    }

    // -----------------------------------
    // Super Admin
    // -----------------------------------

    if (req.user.role === "superAdmin") {
      req.resource = resource;
      req.patientId = patientId;

      return next();
    }

    // -----------------------------------
    // Hospital Admin
    // -----------------------------------

    if (req.user.role === "hospitalAdmin") {
      if (
        resource.hospital &&
        req.user.profileType === "Hospital" &&
        resource.hospital.toString() !==
          req.user.profileId.toString()
      ) {
        throw new ApiError(
          403,
          "You do not have access to this hospital's resource"
        );
      }

      req.resource = resource;
      req.patientId = patientId;

      return next();
    }

    // -----------------------------------
    // Doctor
    // -----------------------------------

    if (req.user.role === "doctor") {
      const consent = await Consent.findOne({
        patient: patientId,
        grantedToDoctor: req.user.profileId,
        status: "Approved",
        $or: [
          {
            expiresAt: null,
          },
          {
            expiresAt: {
              $gt: new Date(),
            },
          },
        ],
      }).sort({
        grantedAt: -1,
      });

      if (!consent) {
        throw new ApiError(
          403,
          "Valid patient consent is required to access this resource"
        );
      }

      // Store consent for later use
      req.consent = consent;
      req.resource = resource;
      req.patientId = patientId;

      return next();
    }

    // -----------------------------------
    // Unknown Role
    // -----------------------------------

    throw new ApiError(
      403,
      "You do not have permission to access this resource"
    );
  });

export default checkResourceAccess;