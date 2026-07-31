import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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

userSchema.index(
  { profileId: 1, profileType: 1 },
  { unique: true }
);

/* ============================
   Password Hashing Middleware
============================ */

userSchema.pre("save", async function (next) {
  // Password change nahi hua to hash mat karo
  if (!this.isModified("password")) {
    return next();
  }

  // Password hash karo
  this.password = await bcrypt.hash(this.password, 10);

  next();
});

/* ============================
   Compare Password
============================ */

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

/* ============================
   Generate Access Token
============================ */

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      role: this.role,
      profileId: this.profileId,
      profileType: this.profileType,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

/* ============================
   Generate Refresh Token
============================ */

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

/* ============================
   User Model
============================ */

const User = model("User", userSchema);

export default User;