import mongoose from "mongoose";

const { Schema, model } = mongoose;

/* ============================
   Reusable Sub Schemas
============================ */

const qualificationSchema = new Schema(
  {
    degree: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    institute: {
      type: String,
      trim: true,
      maxlength: 150,
    },
    year: {
      type: Number,
      min: 1900,
      max: new Date().getFullYear() + 10,
    },
  },
  { _id: false },
);

const hospitalAssociationSchema = new Schema(
  {
    hospital: {
      type: Schema.Types.ObjectId,
      ref: "Hospital",
      required: true,
      index: true,
    },

    department: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    employmentStatus: {
      type: String,
      enum: ["Full-Time", "Part-Time", "Visiting", "Consultant"],
      default: "Full-Time",
    },
  },
  { _id: false },
);

/* ============================
   Doctor Schema
============================ */

const doctorSchema = new Schema(
  {
    /* ============================
       User Reference
    ============================ */

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    /* ============================
       Personal Information
    ============================ */

    Name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    gender: {
      type: String,
      required: true,
      enum: ["Male", "Female", "Other"],
    },

    /* ============================
       Contact Information
    ============================ */

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 255,
      match: [/^\S+@\S+\.\S+$/, "Invalid email address"],
      index: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [/^[6-9]\d{9}$/, "Invalid phone number"],
      index: true,
    },

    /* ============================
       Professional Information
    ============================ */

    medicalRegistrationNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
      maxlength: 100,
      index: true,
    },

    qualification: {
      type: [qualificationSchema],
      validate: {
        validator: (value) => value.length > 0,
        message: "At least one qualification is required.",
      },
    },

    specialization: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
      index: true,
    },

    experience: {
      type: Number,
      required: true,
      min: 0,
      max: 70,
    },

    /* ============================
       Hospital Association
    ============================ */

    hospitals: {
      type: [hospitalAssociationSchema],
      validate: {
        validator: (value) => value.length > 0,
        message: "Doctor must be associated with at least one hospital.",
      },
    },

    /* ============================
       Consultation
    ============================ */

    consultationFee: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    consultationTypes: {
      type: [
        {
          type: String,
          enum: ["OPD", "IPD", "Telemedicine"],
        },
      ],
      required: true,
      validate: {
        validator: (value) => value.length > 0,
        message: "At least one consultation type is required.",
      },
    },

    /* ============================
       Authentication
    ============================ */

    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },

    role: {
      type: String,
      enum: ["Doctor"],
      default: "Doctor",
      immutable: true,
    },

    lastLogin: {
      type: Date,
    },

    /* ============================
       Verification
    ============================ */

    isVerified: {
      type: Boolean,
      default: false,
    },

    verificationStatus: {
      type: String,
      enum: ["Pending", "Verified", "Rejected"],
      default: "Pending",
    },

    /* ============================
       Account Status
    ============================ */

    accountStatus: {
      type: String,
      enum: ["Active", "Inactive", "Suspended"],
      default: "Active",
      index: true,
    },

    /* ============================
       Profile
    ============================ */

    profilePhoto: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

/* ============================
   Compound Indexes
============================ */

doctorSchema.index({
  specialization: 1,
  accountStatus: 1,
});

doctorSchema.index({
  "hospitals.hospital": 1,
  specialization: 1,
});

doctorSchema.index({
  medicalRegistrationNumber: 1,
  isVerified: 1,
});

/* ============================
   Export
============================ */

const Doctor = model("Doctor", doctorSchema);

export default Doctor;
