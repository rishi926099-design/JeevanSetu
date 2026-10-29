import mongoose from "mongoose";

import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { Prescription } from "../models/Prescription.js";

// CREATE PRESCRIPTION
const createPrescription = asyncHandler(async (req, res) => {
  const {
    patient,
    doctor,
    hospital,
    medicalRecord,
    medicines,
    diagnosis,
    additionalInstructions,
    prescribedDate,
    validTill,
    status,
  } = req.body;

  if (
    !patient ||
    !doctor ||
    !hospital ||
    !medicalRecord ||
    !medicines
  ) {
    throw new ApiError(
      400,
      "Patient, doctor, hospital, medical record and medicines are required"
    );
  }

  if (
    !mongoose.Types.ObjectId.isValid(patient) ||
    !mongoose.Types.ObjectId.isValid(doctor) ||
    !mongoose.Types.ObjectId.isValid(hospital) ||
    !mongoose.Types.ObjectId.isValid(medicalRecord)
  ) {
    throw new ApiError(
      400,
      "Invalid patient, doctor, hospital or medical record ID"
    );
  }

  if (!Array.isArray(medicines) || medicines.length === 0) {
    throw new ApiError(400, "At least one medicine is required");
  }

  const prescription = await Prescription.create({
    patient,
    doctor,
    hospital,
    medicalRecord,
    medicines,
    diagnosis,
    additionalInstructions,
    prescribedDate,
    validTill,
    status,
  });

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        prescription,
        "Prescription created successfully"
      )
    );
});

// GET ALL PRESCRIPTIONS
const getAllPrescriptions = asyncHandler(async (req, res) => {
  const prescriptions = await Prescription.find()
    .populate("patient")
    .populate("doctor")
    .populate("hospital")
    .populate("medicalRecord")
    .sort({ prescribedDate: -1 });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        prescriptions,
        "Prescriptions fetched successfully"
      )
    );
});

// GET PRESCRIPTION BY ID
const getPrescriptionById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid prescription ID");
  }

  const prescription = await Prescription.findById(id)
    .populate("patient")
    .populate("doctor")
    .populate("hospital")
    .populate("medicalRecord");

  if (!prescription) {
    throw new ApiError(404, "Prescription not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        prescription,
        "Prescription fetched successfully"
      )
    );
});

// GET PRESCRIPTIONS BY PATIENT
const getPrescriptionsByPatient = asyncHandler(async (req, res) => {
  const { patientId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(patientId)) {
    throw new ApiError(400, "Invalid patient ID");
  }

  const prescriptions = await Prescription.find({
    patient: patientId,
  })
    .populate("doctor")
    .populate("hospital")
    .populate("medicalRecord")
    .sort({ prescribedDate: -1 });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        prescriptions,
        "Patient prescriptions fetched successfully"
      )
    );
});

// UPDATE PRESCRIPTION
const updatePrescription = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid prescription ID");
  }

  const allowedFields = [
    "medicines",
    "diagnosis",
    "additionalInstructions",
    "prescribedDate",
    "validTill",
    "status",
  ];

  const updateData = {};

  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      updateData[field] = req.body[field];
    }
  }

  if (
    updateData.medicines !== undefined &&
    (!Array.isArray(updateData.medicines) ||
      updateData.medicines.length === 0)
  ) {
    throw new ApiError(400, "At least one medicine is required");
  }

  const prescription = await Prescription.findByIdAndUpdate(
    id,
    { $set: updateData },
    {
      new: true,
      runValidators: true,
    }
  )
    .populate("patient")
    .populate("doctor")
    .populate("hospital")
    .populate("medicalRecord");

  if (!prescription) {
    throw new ApiError(404, "Prescription not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        prescription,
        "Prescription updated successfully"
      )
    );
});

// DELETE PRESCRIPTION
const deletePrescription = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid prescription ID");
  }

  const prescription = await Prescription.findByIdAndDelete(id);

  if (!prescription) {
    throw new ApiError(404, "Prescription not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        null,
        "Prescription deleted successfully"
      )
    );
});

export {
  createPrescription,
  getAllPrescriptions,
  getPrescriptionById,
  getPrescriptionsByPatient,
  updatePrescription,
  deletePrescription,
};