import mongoose from "mongoose";

/**
 * Audit Log Schema
 * Purpose:
 * Track every important action performed in the system.
 */

const auditLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
    },

    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
    },

    medicalRecord: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MedicalRecord",
    },

    action: {
      type: String,
      required: true,
      enum: [
        "CREATE",
        "READ",
        "UPDATE",
        "DELETE",
        "LOGIN",
        "LOGOUT",
        "REGISTER",
        "UPLOAD",
        "DOWNLOAD",
        "SHARE",
        "CONSENT_GRANTED",
        "CONSENT_REVOKED",
        "REFERRAL_CREATED",
        "REFERRAL_ACCEPTED",
        "REFERRAL_REJECTED",
        "PRESCRIPTION_CREATED",
      ],
    },

    resource: {
      type: String,
      required: true,
      enum: [
        "User",
        "Patient",
        "Doctor",
        "Hospital",
        "MedicalRecord",
        "Prescription",
        "Referral",
        "Consent",
        "Appointment",
        "LabReport",
      ],
    },

    resourceId: {
      type: mongoose.Schema.Types.ObjectId,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 1000,
    },

    ipAddress: {
      type: String,
      trim: true,
    },

    deviceInfo: {
      type: String,
      trim: true,
    },

    browser: {
      type: String,
      trim: true,
    },

    operatingSystem: {
      type: String,
      trim: true,
    },

    location: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: [
        "Success",
        "Failed",
      ],
      default: "Success",
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Indexes
 */

auditLogSchema.index({
  user: 1,
  createdAt: -1,
});

auditLogSchema.index({
  patient: 1,
});

auditLogSchema.index({
  action: 1,
});

auditLogSchema.index({
  resource: 1,
});

auditLogSchema.index({
  status: 1,
});

/**
 * Export Model
 */

export const AuditLog = mongoose.model(
  "AuditLog",
  auditLogSchema
);