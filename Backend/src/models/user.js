import mongoose from "mongoose";

const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    /* ============================
       Authentication
    ============================ */

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      minlength: 5,
      maxlength: 255,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
      index: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },

    role: {
      type: String,
      required: true,
      enum: ["patient", "doctor", "hospitalAdmin", "superAdmin"],
      index: true,
    },

    /* ============================
       Account Verification
    ============================ */

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    emailVerifiedAt: {
      type: Date,
      default: null,
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
       Security
    ============================ */

    lastLogin: {
      type: Date,
      default: null,
    },

    passwordChangedAt: {
      type: Date,
      default: null,
    },

    refreshToken: {
      type: String,
      select: false,
      default: null,
    },

    failedLoginAttempts: {
      type: Number,
      default: 0,
      min: 0,
    },

    accountLockedUntil: {
      type: Date,
      default: null,
    },

    /* ============================
       Profile Reference
    ============================ */

    profileId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    profileType: {
      type: String,
      required: true,
      enum: ["Patient", "Doctor", "Hospital"],
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/* ============================
   Compound Indexes
============================ */

userSchema.index({ role: 1, accountStatus: 1 });

userSchema.index({ profileId: 1, profileType: 1 }, { unique: true });

const User = model("User", userSchema);

export default User;
