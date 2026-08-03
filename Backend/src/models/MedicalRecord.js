import mongoose from "mongoose";

const vitalSignsSchema = new mongoose.Schema(
  {
    bloodPressure: {
      systolic: {
        type: Number,
        min: 40,
        max: 300,
      },
      diastolic: {
        type: Number,
        min: 20,
        max: 200,
      },
    },

    heartRate: {
      type: Number,
      min: 20,
      max: 250,
    },

    respiratoryRate: {
      type: Number,
      min: 5,
      max: 60,
    },

    temperature: {
      type: Number,
      min: 30,
      max: 45,
    },

    oxygenSaturation: {
      type: Number,
      min: 0,
      max: 100,
    },

    height: {
      type: Number,
      min: 20,
    },

    weight: {
      type: Number,
      min: 1,
    },

    bmi: {
      type: Number,
      min: 1,
    },
  },
  { _id: false }
);

const medicalRecordSchema = new mongoose.Schema(
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

    diagnosis: {
      type: String,
      required: true,
      trim: true,
    },

    symptoms: [
      {
        type: String,
        trim: true,
      },
    ],

    vitalSigns: vitalSignsSchema,

    reportType: {
      type: String,
      enum: [
        "Consultation",
        "Lab Report",
        "Radiology",
        "Prescription",
        "Discharge Summary",
        "Operation Note",
        "Vaccination",
        "Other",
      ],
      default: "Consultation",
    },

    reportTitle: {
      type: String,
      required: true,
      trim: true,
    },

    reportFile: {
      type: String,
      trim: true,
    },

    notes: {
      type: String,
      trim: true,
      maxlength: 5000,
    },

    visitDate: {
      type: Date,
      required: true,
      default: Date.now,
    },

    followUpDate: {
      type: Date,
    },

    status: {
      type: String,
      enum: ["Active", "Archived"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

/* Indexes */

medicalRecordSchema.index({
  patient: 1,
  visitDate: -1,
});

medicalRecordSchema.index({
  doctor: 1,
  visitDate: -1,
});

medicalRecordSchema.index({
  hospital: 1,
});

medicalRecordSchema.index({
  reportType: 1,
});

export const MedicalRecord = mongoose.model("MedicalRecord", medicalRecordSchema);
