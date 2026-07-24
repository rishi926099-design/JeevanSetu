const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    // ======================================================
    // 1. PERSONAL INFORMATION
    // ======================================================

    Name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },

    gender: {
      type: String,
      required: true,
      enum: ["Male", "Female", "Other"],
    },

    dateOfBirth: {
      type: Date,
      required: true,
    },

    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },

    maritalStatus: {
      type: String,
      enum: ["Single", "Married", "Divorced", "Widowed"],
      default: "Single",
    },

    // ======================================================
    // 2. CONTACT INFORMATION
    // ======================================================

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    address: {
      street: {
        type: String,
        trim: true,
      },
      city: {
        type: String,
        trim: true,
      },
      state: {
        type: String,
        trim: true,
      },
      country: {
        type: String,
        trim: true,
        default: "India",
      },
      postalCode: {
        type: String,
        trim: true,
      },
    },

    // ======================================================
    // 3. EMERGENCY CONTACT
    // ======================================================

    emergencyContact: {
      name: {
        type: String,
        trim: true,
      },

      relationship: {
        type: String,
        trim: true,
      },

      phone: {
        type: String,
        trim: true,
      },
    },

    // ======================================================
    // 4. MEDICAL PROFILE
    // ======================================================

    allergies: [
      {
        type: String,
        trim: true,
      },
    ],

    chronicDiseases: [
      {
        type: String,
        trim: true,
      },
    ],

    disabilities: [
      {
        type: String,
        trim: true,
      },
    ],

    organDonor: {
      type: Boolean,
      default: false,
    },

    // ======================================================
    // 5. HEALTH INFORMATION
    // ======================================================

    height: Number,

    weight: Number,

    smokingStatus: {
      type: String,
      enum: ["Never", "Former", "Current"],
    },

    alcoholConsumption: {
      type: String,
      enum: ["Never", "Occasionally", "Regularly"],
    },

    // ======================================================
    // 6. IDENTIFICATION
    // ======================================================

    nationalId: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },

    insuranceNumber: {
      type: String,
      trim: true,
      sparse: true,
    },

    // ======================================================
    // 7. ACCOUNT STATUS
    // ======================================================

    accountStatus: {
      type: String,
      enum: ["Active", "Inactive", "Suspended"],
      default: "Active",
    },

    emailVerified: {
      type: Boolean,
      default: false,
    },

    phoneVerified: {
      type: Boolean,
      default: false,
    },

    // ======================================================
    // 8. AVATAR
    // ======================================================

    avatar: {
      url: {
        type: String,
        trim: true,
      },

      publicId: {
        type: String,
        trim: true,
      },
    },

    // ======================================================
    // 9. REFERENCES
    // ======================================================

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // ======================================================
    // 10. METADATA
    // ======================================================

    lastLogin: {
      type: Date,
    },

    lastProfileUpdate: {
      type: Date,
      default: Date.now,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// ======================================================
// INDEXES
// ======================================================

patientSchema.index({ email: 1 });

patientSchema.index({ phone: 1 });

patientSchema.index({ nationalId: 1 });

patientSchema.index({ accountStatus: 1 });

patientSchema.index({ firstName: 1, lastName: 1 });

module.exports = mongoose.model("Patient", patientSchema);
