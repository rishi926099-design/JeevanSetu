import mongoose from "mongoose";

/**
 * Referral Schema
 * Purpose:
 * Store Doctor-to-Doctor / Hospital-to-Hospital referrals.
 */

const referralSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
      index: true,
    },

    medicalRecord: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MedicalRecord",
      required: true,
      index: true,
    },

    referredByDoctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },

    referredToDoctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
    },

    referredFromHospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
      required: true,
    },

    referredToHospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
      required: true,
    },

    reason: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

    diagnosis: {
      type: String,
      trim: true,
    },

    specialityRequired: {
      type: String,
      trim: true,
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Emergency"],
      default: "Medium",
    },

    referralStatus: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected", "Completed", "Cancelled"],
      default: "Pending",
    },

    notes: {
      type: String,
      trim: true,
      maxlength: 3000,
    },

    referralDate: {
      type: Date,
      default: Date.now,
    },

    expectedVisitDate: {
      type: Date,
    },

    completedDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Indexes
 */

referralSchema.index({
  patient: 1,
  referralDate: -1,
});

referralSchema.index({
  referredToHospital: 1,
});

referralSchema.index({
  referredByDoctor: 1,
});

referralSchema.index({
  referralStatus: 1,
});

referralSchema.index({
  priority: 1,
});

/**
 * Export Model
 */

export const Referral = mongoose.model("Referral", referralSchema);
