import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import AuditLog from "../models/auditLog.model.js";

const getAllAuditLogs = asyncHandler(async (req, res) => {});

const getAuditLogById = asyncHandler(async (req, res) => {});

export {
    getAllAuditLogs,
    getAuditLogById,
};