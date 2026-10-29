import mongoose from "mongoose";

import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { AuditLog } from "../models/AuditLog.js";

// GET ALL AUDIT LOGS
const getAllAuditLogs = asyncHandler(async (req, res) => {
  const {
    user,
    patient,
    hospital,
    action,
    resource,
    status,
    page = 1,
    limit = 20,
  } = req.query;

  const filter = {};

  if (user) {
    if (!mongoose.Types.ObjectId.isValid(user)) {
      throw new ApiError(400, "Invalid user ID");
    }
    filter.user = user;
  }

  if (patient) {
    if (!mongoose.Types.ObjectId.isValid(patient)) {
      throw new ApiError(400, "Invalid patient ID");
    }
    filter.patient = patient;
  }

  if (hospital) {
    if (!mongoose.Types.ObjectId.isValid(hospital)) {
      throw new ApiError(400, "Invalid hospital ID");
    }
    filter.hospital = hospital;
  }

  if (action) {
    filter.action = action;
  }

  if (resource) {
    filter.resource = resource;
  }

  if (status) {
    filter.status = status;
  }

  const pageNumber = Math.max(Number(page), 1);
  const limitNumber = Math.min(Math.max(Number(limit), 1), 100);
  const skip = (pageNumber - 1) * limitNumber;

  const [logs, total] = await Promise.all([
    AuditLog.find(filter)
      .populate("user")
      .populate("patient")
      .populate("hospital")
      .populate("medicalRecord")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber),

    AuditLog.countDocuments(filter),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        logs,
        pagination: {
          total,
          page: pageNumber,
          limit: limitNumber,
          totalPages: Math.ceil(total / limitNumber),
        },
      },
      "Audit logs fetched successfully"
    )
  );
});

// GET AUDIT LOG BY ID
const getAuditLogById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid audit log ID");
  }

  const auditLog = await AuditLog.findById(id)
    .populate("user")
    .populate("patient")
    .populate("hospital")
    .populate("medicalRecord");

  if (!auditLog) {
    throw new ApiError(404, "Audit log not found");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      auditLog,
      "Audit log fetched successfully"
    )
  );
});

// GET AUDIT LOGS BY PATIENT
const getAuditLogsByPatient = asyncHandler(async (req, res) => {
  const { patientId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(patientId)) {
    throw new ApiError(400, "Invalid patient ID");
  }

  const logs = await AuditLog.find({
    patient: patientId,
  })
    .populate("user")
    .populate("hospital")
    .populate("medicalRecord")
    .sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse(
      200,
      logs,
      "Patient audit logs fetched successfully"
    )
  );
});

// GET AUDIT LOGS BY USER
const getAuditLogsByUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, "Invalid user ID");
  }

  const logs = await AuditLog.find({
    user: userId,
  })
    .populate("patient")
    .populate("hospital")
    .populate("medicalRecord")
    .sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse(
      200,
      logs,
      "User audit logs fetched successfully"
    )
  );
});

export {
  getAllAuditLogs,
  getAuditLogById,
  getAuditLogsByPatient,
  getAuditLogsByUser,
};