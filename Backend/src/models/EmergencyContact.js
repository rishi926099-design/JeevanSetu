import mongoose from "mongoose";

const { Schema, model } = mongoose;

const emergencyContactSchema = new Schema(
  {
    patient: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    relationship: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20,
    },

    alternatePhone: {
      type: String,
      trim: true,
      maxlength: 20,
      default: "",
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
      match: [
        /^\S+@\S+\.\S+$/,
        "Please provide a valid email address",
      ],
      default: null,
    },

    address: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },

    isPrimary: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

emergencyContactSchema.index({
  patient: 1,
  isPrimary: 1,
});

const EmergencyContact = model(
  "EmergencyContact",
  emergencyContactSchema
);

export default EmergencyContact;