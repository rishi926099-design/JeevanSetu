import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Prescription from "../models/prescription.model.js";

const createPrescription = asyncHandler(async (req, res) => {});

const getAllPrescriptions = asyncHandler(async (req, res) => {});

const getPrescriptionById = asyncHandler(async (req, res) => {});

const updatePrescription = asyncHandler(async (req, res) => {});

const deletePrescription = asyncHandler(async (req, res) => {});

export {
    createPrescription,
    getAllPrescriptions,
    getPrescriptionById,
    updatePrescription,
    deletePrescription,
};