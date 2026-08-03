import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Consent from "../models/consent.model.js";

const createConsent = asyncHandler(async (req, res) => {});

const getAllConsents = asyncHandler(async (req, res) => {});

const getConsentById = asyncHandler(async (req, res) => {});

const updateConsent = asyncHandler(async (req, res) => {});

const deleteConsent = asyncHandler(async (req, res) => {});

export {
    createConsent,
    getAllConsents,
    getConsentById,
    updateConsent,
    deleteConsent,
};