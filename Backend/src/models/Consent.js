import mongoose from "mongoose";

/**
 * Consent Schema
 * Purpose:
 * Manage patient consent for sharing Electronic Health Records (EHR).
 */

const consentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
      index: true,
    },

    grantedToHospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
      required: true,
    },

    grantedToDoctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
    },

    medicalRecord: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MedicalRecord",
    },

    consentType: {
      type: String,
      required: true,
      enum: [
        "Medical Record Access",
        "Referral",
        "Prescription Access",
        "Lab Report Access",
        "Emergency Access",
        "Full Health Record",
      ],
    },

    purpose: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

    accessLevel: {
      type: String,
      enum: [
        "Read",
        "Read & Download",
        "Full Access",
      ],
      default: "Read",
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Approved",
        "Rejected",
        "Revoked",
        "Expired",
      ],
      default: "Pending",
    },

    grantedAt: {
      type: Date,
      default: Date.now,
    },

    expiresAt: {
      type: Date,
    },

    revokedAt: {
      type: Date,
    },

    revokedReason: {
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
  },
  {
    timestamps: true,
  }
);

/**
 * Indexes
 */

consentSchema.index({
  patient: 1,
  status: 1,
});

consentSchema.index({
  grantedToHospital: 1,
});

consentSchema.index({
  consentType: 1,
});

consentSchema.index({
  expiresAt: 1,
});

/**
 * Export Model
 */

export const Consent = mongoose.model(
  "Consent",
  consentSchema
);