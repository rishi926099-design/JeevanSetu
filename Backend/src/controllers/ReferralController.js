import mongoose from "mongoose";

import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { Referral } from "../models/Referral.js";

// CREATE REFERRAL
const createReferral = asyncHandler(async (req, res) => {
  const {
    patient,
    medicalRecord,
    referredByDoctor,
    referredToDoctor,
    referredFromHospital,
    referredToHospital,
    reason,
    diagnosis,
    specialityRequired,
    priority,
    referralStatus,
    notes,
    referralDate,
    expectedVisitDate,
    completedDate,
  } = req.body;

  if (
    !patient ||
    !medicalRecord ||
    !referredByDoctor ||
    !referredFromHospital ||
    !referredToHospital ||
    !reason
  ) {
    throw new ApiError(
      400,
      "Patient, medical record, referring doctor, source hospital, destination hospital and reason are required"
    );
  }

  const objectIds = [
    patient,
    medicalRecord,
    referredByDoctor,
    referredFromHospital,
    referredToHospital,
  ];

  if (
    referredToDoctor &&
    !mongoose.Types.ObjectId.isValid(referredToDoctor)
  ) {
    throw new ApiError(400, "Invalid referred-to doctor ID");
  }

  if (objectIds.some((id) => !mongoose.Types.ObjectId.isValid(id))) {
    throw new ApiError(400, "One or more IDs are invalid");
  }

  const referral = await Referral.create({
    patient,
    medicalRecord,
    referredByDoctor,
    referredToDoctor,
    referredFromHospital,
    referredToHospital,
    reason,
    diagnosis,
    specialityRequired,
    priority,
    referralStatus,
    notes,
    referralDate,
    expectedVisitDate,
    completedDate,
  });

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        referral,
        "Referral created successfully"
      )
    );
});

// GET ALL REFERRALS
const getAllReferrals = asyncHandler(async (req, res) => {
  const referrals = await Referral.find()
    .populate("patient")
    .populate("medicalRecord")
    .populate("referredByDoctor")
    .populate("referredToDoctor")
    .populate("referredFromHospital")
    .populate("referredToHospital")
    .sort({ referralDate: -1 });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        referrals,
        "Referrals fetched successfully"
      )
    );
});

// GET REFERRAL BY ID
const getReferralById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid referral ID");
  }

  const referral = await Referral.findById(id)
    .populate("patient")
    .populate("medicalRecord")
    .populate("referredByDoctor")
    .populate("referredToDoctor")
    .populate("referredFromHospital")
    .populate("referredToHospital");

  if (!referral) {
    throw new ApiError(404, "Referral not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        referral,
        "Referral fetched successfully"
      )
    );
});

// GET REFERRALS BY PATIENT
const getReferralsByPatient = asyncHandler(async (req, res) => {
  const { patientId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(patientId)) {
    throw new ApiError(400, "Invalid patient ID");
  }

  const referrals = await Referral.find({
    patient: patientId,
  })
    .populate("medicalRecord")
    .populate("referredByDoctor")
    .populate("referredToDoctor")
    .populate("referredFromHospital")
    .populate("referredToHospital")
    .sort({ referralDate: -1 });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        referrals,
        "Patient referrals fetched successfully"
      )
    );
});

// UPDATE REFERRAL
const updateReferral = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid referral ID");
  }

  const allowedFields = [
    "referredToDoctor",
    "reason",
    "diagnosis",
    "specialityRequired",
    "priority",
    "referralStatus",
    "notes",
    "referralDate",
    "expectedVisitDate",
    "completedDate",
  ];

  const updateData = {};

  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      updateData[field] = req.body[field];
    }
  }

  if (
    updateData.referredToDoctor &&
    !mongoose.Types.ObjectId.isValid(updateData.referredToDoctor)
  ) {
    throw new ApiError(400, "Invalid referred-to doctor ID");
  }

  const referral = await Referral.findByIdAndUpdate(
    id,
    { $set: updateData },
    {
      new: true,
      runValidators: true,
    }
  )
    .populate("patient")
    .populate("medicalRecord")
    .populate("referredByDoctor")
    .populate("referredToDoctor")
    .populate("referredFromHospital")
    .populate("referredToHospital");

  if (!referral) {
    throw new ApiError(404, "Referral not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        referral,
        "Referral updated successfully"
      )
    );
});

// DELETE REFERRAL
const deleteReferral = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid referral ID");
  }

  const referral = await Referral.findByIdAndDelete(id);

  if (!referral) {
    throw new ApiError(404, "Referral not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        null,
        "Referral deleted successfully"
      )
    );
});

export {
  createReferral,
  getAllReferrals,
  getReferralById,
  getReferralsByPatient,
  updateReferral,
  deleteReferral,
};