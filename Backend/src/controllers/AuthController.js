import mongoose from "mongoose";
import Patient from "../models/Patient.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

import User from "../models/User.js";

// ==========================================
// TOKEN GENERATORS
// ==========================================

const generateAccessToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      role: user.role,
      profileId: user.profileId,
      profileType: user.profileType,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m",
    }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d",
    }
  );
};

// ==========================================
// REGISTER
// ==========================================

const register = asyncHandler(async (req, res) => {
  const {
    email,
    password,
    role,

    // Patient profile fields
    name,
    gender,
    dateOfBirth,
    bloodGroup,
    maritalStatus,
    phone,
    address,
  } = req.body;

  if (!email || !password || !role) {
    throw new ApiError(
      400,
      "Email, password and role are required"
    );
  }

  if (!["patient"].includes(role)) {
    throw new ApiError(
      400,
      "Currently only patient registration is supported"
    );
  }

  if (
    !name ||
    !gender ||
    !dateOfBirth ||
    !phone
  ) {
    throw new ApiError(
      400,
      "Name, gender, dateOfBirth and phone are required for patient registration"
    );
  }

  const normalizedEmail = email.toLowerCase().trim();

  const existingUser = await User.findOne({
    email: normalizedEmail,
  });

  if (existingUser) {
    throw new ApiError(
      409,
      "User with this email already exists"
    );
  }

  const existingPatient = await Patient.findOne({
    $or: [
      { email: normalizedEmail },
      { phone: phone.trim() },
    ],
  });

  if (existingPatient) {
    throw new ApiError(
      409,
      "Patient with this email or phone already exists"
    );
  }

  const session = await mongoose.startSession();

  try {
    let createdPatient;
    let createdUser;

    await session.withTransaction(async () => {
      // Generate temporary User ID
      const userId = new mongoose.Types.ObjectId();

      // Create Patient first using User ID
      const patient = new Patient({
        _id: new mongoose.Types.ObjectId(),
        Name: name.trim(),
        gender,
        dateOfBirth,
        bloodGroup,
        maritalStatus,
        email: normalizedEmail,
        phone: phone.trim(),
        address,
        user: userId,
      });

      createdPatient = await patient.save({ session });

      // Hash password
      const hashedPassword = await bcrypt.hash(
        password,
        12
      );

      // Create User using Patient ID
      const user = new User({
        _id: userId,
        email: normalizedEmail,
        password: hashedPassword,
        role: "patient",
        profileId: createdPatient._id,
        profileType: "Patient",
      });

      createdUser = await user.save({ session });
    });

    const safeUser = await User.findById(
      createdUser._id
    ).select("-password -refreshToken");

    return res.status(201).json(
      new ApiResponse(
        201,
        {
          user: safeUser,
          patient: createdPatient,
        },
        "Patient registered successfully"
      )
    );
  } finally {
    await session.endSession();
  }
});

// ==========================================
// LOGIN
// ==========================================

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(
      400,
      "Email and password are required"
    );
  }

  const user = await User.findOne({
    email: email.toLowerCase(),
  }).select("+password +refreshToken");

  if (!user) {
    throw new ApiError(
      401,
      "Invalid email or password"
    );
  }

  // Account lock check
  if (
    user.accountLockedUntil &&
    user.accountLockedUntil > new Date()
  ) {
    throw new ApiError(
      423,
      "Account temporarily locked. Please try again later."
    );
  }

  if (user.accountStatus !== "Active") {
    throw new ApiError(
      403,
      "Your account is not active"
    );
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    user.password
  );

  if (!isPasswordValid) {
    user.failedLoginAttempts += 1;

    // Lock after 5 failed attempts
    if (user.failedLoginAttempts >= 5) {
      user.accountLockedUntil = new Date(
        Date.now() + 15 * 60 * 1000
      );
      user.failedLoginAttempts = 0;
    }

    await user.save();

    throw new ApiError(
      401,
      "Invalid email or password"
    );
  }

  // Reset failed attempts
  user.failedLoginAttempts = 0;
  user.accountLockedUntil = null;
  user.lastLogin = new Date();

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshToken = refreshToken;

  await user.save();

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite:
      process.env.NODE_ENV === "production"
        ? "none"
        : "lax",
  };

  res.cookie(
    "accessToken",
    accessToken,
    {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000,
    }
  );

  res.cookie(
    "refreshToken",
    refreshToken,
    {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    }
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user: loggedInUser,
        accessToken,
        refreshToken,
      },
      "Login successful"
    )
  );
});

// ==========================================
// REFRESH TOKEN
// ==========================================

const refreshAccessToken = asyncHandler(
  async (req, res) => {
    const incomingRefreshToken =
      req.cookies?.refreshToken ||
      req.body?.refreshToken;

    if (!incomingRefreshToken) {
      throw new ApiError(
        401,
        "Refresh token is required"
      );
    }

    let decodedToken;

    try {
      decodedToken = jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
    } catch (error) {
      throw new ApiError(
        401,
        "Invalid or expired refresh token"
      );
    }

    const user = await User.findById(
      decodedToken?._id
    ).select("+refreshToken");

    if (!user) {
      throw new ApiError(
        401,
        "User not found"
      );
    }

    if (
      !user.refreshToken ||
      user.refreshToken !== incomingRefreshToken
    ) {
      throw new ApiError(
        401,
        "Refresh token is invalid or has been revoked"
      );
    }

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    user.refreshToken = newRefreshToken;

    await user.save();

    res.cookie(
      "accessToken",
      newAccessToken,
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite:
          process.env.NODE_ENV === "production"
            ? "none"
            : "lax",
        maxAge: 15 * 60 * 1000,
      }
    );

    res.cookie(
      "refreshToken",
      newRefreshToken,
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite:
          process.env.NODE_ENV === "production"
            ? "none"
            : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      }
    );

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        },
        "Access token refreshed successfully"
      )
    );
  }
);

// ==========================================
// CURRENT USER
// ==========================================

const getCurrentUser = asyncHandler(
  async (req, res) => {
    const user = await User.findById(req.user._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(
        404,
        "User not found"
      );
    }

    return res.status(200).json(
      new ApiResponse(
        200,
        user,
        "Current user fetched successfully"
      )
    );
  }
);

// ==========================================
// LOGOUT
// ==========================================

const logout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, {
    $set: {
      refreshToken: null,
    },
  });

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite:
      process.env.NODE_ENV === "production"
        ? "none"
        : "lax",
  };

  res.clearCookie("accessToken", cookieOptions);
  res.clearCookie("refreshToken", cookieOptions);

  return res.status(200).json(
    new ApiResponse(
      200,
      null,
      "Logout successful"
    )
  );
});

// ==========================================
// CHANGE PASSWORD
// ==========================================

const changePassword = asyncHandler(
  async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      throw new ApiError(
        400,
        "Old password and new password are required"
      );
    }

    if (newPassword.length < 8) {
      throw new ApiError(
        400,
        "New password must be at least 8 characters"
      );
    }

    const user = await User.findById(
      req.user._id
    ).select("+password +refreshToken");

    if (!user) {
      throw new ApiError(
        404,
        "User not found"
      );
    }

    const isPasswordValid = await bcrypt.compare(
      oldPassword,
      user.password
    );

    if (!isPasswordValid) {
      throw new ApiError(
        401,
        "Current password is incorrect"
      );
    }

    user.password = await bcrypt.hash(
      newPassword,
      12
    );

    user.passwordChangedAt = new Date();

    // Revoke refresh token after password change
    user.refreshToken = null;

    await user.save();

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    return res.status(200).json(
      new ApiResponse(
        200,
        null,
        "Password changed successfully. Please login again."
      )
    );
  }
);

// ==========================================
// CREATE SUPER ADMIN
// DEVELOPMENT ONLY
// ==========================================

const createSuperAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(
      400,
      "Email and password are required"
    );
  }

  if (password.length < 8) {
    throw new ApiError(
      400,
      "Password must be at least 8 characters"
    );
  }

  const normalizedEmail = email.toLowerCase().trim();

  const existingUser = await User.findOne({
    email: normalizedEmail,
  });

  if (existingUser) {
    throw new ApiError(
      409,
      "User with this email already exists"
    );
  }

  const hashedPassword = await bcrypt.hash(
    password,
    12
  );

  const superAdmin = await User.create({
    email: normalizedEmail,
    password: hashedPassword,
    role: "superAdmin",

    // User schema currently requires these fields
    profileId: new mongoose.Types.ObjectId(),
    profileType: "Hospital",

    isEmailVerified: true,
    emailVerifiedAt: new Date(),
    accountStatus: "Active",
  });

  const safeAdmin = await User.findById(
    superAdmin._id
  ).select("-password -refreshToken");

  return res.status(201).json(
    new ApiResponse(
      201,
      safeAdmin,
      "Super Admin created successfully"
    )
  );
});

export {
  register,
  login,
  refreshAccessToken,
  getCurrentUser,
  logout,
  changePassword,
  
  createSuperAdmin,

};