import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import MedicalRecord from "../models/medicalRecord.model.js";

const createMedicalRecord = asyncHandler(async (req, res) => {});

const getAllMedicalRecords = asyncHandler(async (req, res) => {});

const getMedicalRecordById = asyncHandler(async (req, res) => {});

const updateMedicalRecord = asyncHandler(async (req, res) => {});

const deleteMedicalRecord = asyncHandler(async (req, res) => {});

export {
    createMedicalRecord,
    getAllMedicalRecords,
    getMedicalRecordById,
    updateMedicalRecord,
    deleteMedicalRecord,
};