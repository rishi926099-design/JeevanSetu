import mongoose from "mongoose";

import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { Consent } from "../models/Consent.js";

// CREATE CONSENT
const createConsent = asyncHandler(async (req, res) => {
  const {
    patient,
    grantedToHospital,
    grantedToDoctor,
    medicalRecord,
    consentType,
    purpose,
    accessLevel,
    expiresAt,
    ipAddress,
    deviceInfo,
  } = req.body;

  if (
    !patient ||
    !grantedToHospital ||
    !consentType ||
    !purpose
  ) {
    throw new ApiError(
      400,
      "Patient, hospital, consent type and purpose are required"
    );
  }

  const ids = [
    patient,
    grantedToHospital,
    grantedToDoctor,
    medicalRecord,
  ].filter(Boolean);

  if (ids.some((id) => !mongoose.Types.ObjectId.isValid(id))) {
    throw new ApiError(400, "One or more IDs are invalid");
  }

  const consent = await Consent.create({
    patient,
    grantedToHospital,
    grantedToDoctor,
    medicalRecord,
    consentType,
    purpose,
    accessLevel,
    expiresAt,
    ipAddress,
    deviceInfo,
  });

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        consent,
        "Consent created successfully"
      )
    );
});

// GET ALL CONSENTS
const getAllConsents = asyncHandler(async (req, res) => {
  const consents = await Consent.find()
    .populate("patient")
    .populate("grantedToHospital")
    .populate("grantedToDoctor")
    .populate("medicalRecord")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        consents,
        "Consents fetched successfully"
      )
    );
});

// GET CONSENT BY ID
const getConsentById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid consent ID");
  }

  const consent = await Consent.findById(id)
    .populate("patient")
    .populate("grantedToHospital")
    .populate("grantedToDoctor")
    .populate("medicalRecord");

  if (!consent) {
    throw new ApiError(404, "Consent not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        consent,
        "Consent fetched successfully"
      )
    );
});

// GET CONSENTS BY PATIENT
const getConsentsByPatient = asyncHandler(async (req, res) => {
  const { patientId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(patientId)) {
    throw new ApiError(400, "Invalid patient ID");
  }

  const consents = await Consent.find({
    patient: patientId,
  })
    .populate("grantedToHospital")
    .populate("grantedToDoctor")
    .populate("medicalRecord")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        consents,
        "Patient consents fetched successfully"
      )
    );
});

// UPDATE CONSENT
const updateConsent = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid consent ID");
  }

  const allowedFields = [
    "consentType",
    "purpose",
    "accessLevel",
    "status",
    "expiresAt",
    "revokedAt",
    "revokedReason",
  ];

  const updateData = {};

  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      updateData[field] = req.body[field];
    }
  }

  const consent = await Consent.findByIdAndUpdate(
    id,
    { $set: updateData },
    {
      new: true,
      runValidators: true,
    }
  )
    .populate("patient")
    .populate("grantedToHospital")
    .populate("grantedToDoctor")
    .populate("medicalRecord");

  if (!consent) {
    throw new ApiError(404, "Consent not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        consent,
        "Consent updated successfully"
      )
    );
});

// REVOKE CONSENT
const revokeConsent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { revokedReason } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid consent ID");
  }

  const consent = await Consent.findByIdAndUpdate(
    id,
    {
      $set: {
        status: "Revoked",
        revokedAt: new Date(),
        revokedReason: revokedReason || "Consent revoked by patient",
      },
    },
    {
      new: true,
      runValidators: true,
    }
  )
    .populate("patient")
    .populate("grantedToHospital")
    .populate("grantedToDoctor")
    .populate("medicalRecord");

  if (!consent) {
    throw new ApiError(404, "Consent not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        consent,
        "Consent revoked successfully"
      )
    );
});

// DELETE CONSENT
const deleteConsent = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid consent ID");
  }

  const consent = await Consent.findByIdAndDelete(id);

  if (!consent) {
    throw new ApiError(404, "Consent not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        null,
        "Consent deleted successfully"
      )
    );
});

export {
  createConsent,
  getAllConsents,
  getConsentById,
  getConsentsByPatient,
  updateConsent,
  revokeConsent,
  deleteConsent,
};