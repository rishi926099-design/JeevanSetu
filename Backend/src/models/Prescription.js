import mongoose from "mongoose";

/**
 * Medicine Sub Schema
 */
const medicineSchema = new mongoose.Schema(
  {
    medicineName: {
      type: String,
      required: true,
      trim: true,
    },

    dosage: {
      type: String,
      required: true,
      trim: true,
    },

    frequency: {
      type: String,
      required: true,
      enum: [
        "Once Daily",
        "Twice Daily",
        "Three Times Daily",
        "Four Times Daily",
        "Every 6 Hours",
        "Every 8 Hours",
        "Every 12 Hours",
        "Weekly",
        "SOS",
      ],
    },

    duration: {
      type: String,
      required: true,
      trim: true,
    },

    route: {
      type: String,
      enum: [
        "Oral",
        "Injection",
        "IV",
        "IM",
        "Topical",
        "Inhalation",
        "Eye Drops",
        "Ear Drops",
        "Nasal",
        "Other",
      ],
      default: "Oral",
    },

    instructions: {
      type: String,
      trim: true,
    },

    beforeMeal: {
      type: Boolean,
      default: false,
    },

    afterMeal: {
      type: Boolean,
      default: true,
    },
  },
  {
    _id: false,
  }
);

/**
 * Prescription Schema
 */

const prescriptionSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
      index: true,
    },

    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
      index: true,
    },

    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
      required: true,
      index: true,
    },

    medicalRecord: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MedicalRecord",
      required: true,
      index: true,
    },

    medicines: {
      type: [medicineSchema],
      validate: {
        validator: (value) => value.length > 0,
        message: "At least one medicine is required.",
      },
    },

    diagnosis: {
      type: String,
      trim: true,
    },

    additionalInstructions: {
      type: String,
      trim: true,
      maxlength: 3000,
    },

    prescribedDate: {
      type: Date,
      default: Date.now,
    },

    validTill: {
      type: Date,
    },

    status: {
      type: String,
      enum: [
        "Active",
        "Completed",
        "Cancelled",
        "Expired",
      ],
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Indexes
 */

prescriptionSchema.index({
  patient: 1,
  prescribedDate: -1,
});

prescriptionSchema.index({
  doctor: 1,
});

prescriptionSchema.index({
  medicalRecord: 1,
});

prescriptionSchema.index({
  hospital: 1,
});

/**
 * Export Model
 */

export const Prescription = mongoose.model(
  "Prescription",
  prescriptionSchema
);