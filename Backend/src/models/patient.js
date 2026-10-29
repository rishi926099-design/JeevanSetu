import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
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
      street: String,
      city: String,
      state: String,
      country: {
        type: String,
        default: "India",
      },
      postalCode: String,
    },

    emergencyContact: {
      name: String,
      relationship: String,
      phone: String,
    },

    allergies: [String],
    chronicDiseases: [String],
    disabilities: [String],

    organDonor: {
      type: Boolean,
      default: false,
    },

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

    avatar: {
      url: String,
      publicId: String,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    lastLogin: Date,

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
  }
);

patientSchema.index({ email: 1 });
patientSchema.index({ phone: 1 });
patientSchema.index({ accountStatus: 1 });

const Patient = mongoose.model("Patient", patientSchema);

export default Patient;