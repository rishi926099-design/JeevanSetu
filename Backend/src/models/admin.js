import mongoose from "mongoose";

const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    /* ============================
       Identity
    ============================ */

    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      minlength: 5,
      maxlength: 255,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
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
      enum: ["active", "inactive", "suspended"],
      default: "active",
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
      default: null,
      select: false,
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
       Profile Mapping
    ============================ */

    profileId: {
      type: Schema.Types.ObjectId,
      required: function () {
        return this.role !== "superAdmin";
      },
      index: true,
    },

    profileType: {
      type: String,
      enum: ["Patient", "Doctor", "Hospital"],
      required: function () {
        return this.role !== "superAdmin";
      },
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

/* ============================
   Indexes
============================ */

userSchema.index({ role: 1, accountStatus: 1 });

userSchema.index(
  { profileId: 1, profileType: 1 },
  {
    unique: true,
    partialFilterExpression: {
      profileId: { $exists: true },
    },
  },
);

const User = model("User", userSchema);

export default User;
