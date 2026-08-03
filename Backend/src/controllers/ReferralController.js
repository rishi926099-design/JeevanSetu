import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Referral from "../models/referral.model.js";

const createReferral = asyncHandler(async (req, res) => {});

const getAllReferrals = asyncHandler(async (req, res) => {});

const getReferralById = asyncHandler(async (req, res) => {});

const updateReferral = asyncHandler(async (req, res) => {});

const deleteReferral = asyncHandler(async (req, res) => {});

export {
    createReferral,
    getAllReferrals,
    getReferralById,
    updateReferral,
    deleteReferral,
};