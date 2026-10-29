import mongoose from "mongoose";

import Hospital from "../models/Hospital.js";

import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

// ==========================================
// CREATE HOSPITAL
// ==========================================

const createHospital = asyncHandler(async (req, res) => {
  const {
    hospitalName,
    hospitalCode,
    registrationNumber,
    description,
    logo,
    contact,
    address,
    geoLocation,
    hospitalType,
    ownership,
    departments,
    specializations,
    facilities,
    services,
    capacity,
    workingHours,
    emergencyServices,
    aiFeatures,
  } = req.body;

  if (!hospitalName || !hospitalCode || !registrationNumber) {
    throw new ApiError(
      400,
      "Hospital name, hospital code and registration number are required"
    );
  }

  if (
    !address?.city ||
    !address?.district ||
    !address?.state ||
    !address?.pincode
  ) {
    throw new ApiError(
      400,
      "City, district, state and pincode are required"
    );
  }

  const existingHospital = await Hospital.findOne({
    $or: [
      {
        hospitalCode: hospitalCode
          .toUpperCase()
          .trim(),
      },
      {
        registrationNumber:
          registrationNumber.trim(),
      },
    ],
    isDeleted: false,
  });

  if (existingHospital) {
    throw new ApiError(
      409,
      "Hospital with this code or registration number already exists"
    );
  }

  const hospital = await Hospital.create({
    hospitalName: hospitalName.trim(),

    hospitalCode: hospitalCode
      .toUpperCase()
      .trim(),

    registrationNumber:
      registrationNumber.trim(),

    description,
    logo,
    contact,
    address,
    geoLocation,
    hospitalType,
    ownership,
    departments,
    specializations,
    facilities,
    services,
    capacity,
    workingHours,
    emergencyServices,
    aiFeatures,

    createdBy: req.user._id,
    updatedBy: req.user._id,

    status: "Active",
    isDeleted: false,
  });

  return res.status(201).json(
    new ApiResponse(
      201,
      hospital,
      "Hospital created successfully"
    )
  );
});

// ==========================================
// GET ALL HOSPITALS
// ==========================================

const getAllHospitals = asyncHandler(
  async (req, res) => {
    const {
      city,
      state,
      hospitalType,
      ownership,
      search,
    } = req.query;

    const filter = {
      isDeleted: false,
      status: "Active",
    };

    if (city) {
      filter["address.city"] = new RegExp(
        `^${city}$`,
        "i"
      );
    }

    if (state) {
      filter["address.state"] = new RegExp(
        `^${state}$`,
        "i"
      );
    }

    if (hospitalType) {
      filter.hospitalType = hospitalType;
    }

    if (ownership) {
      filter.ownership = ownership;
    }

    if (search) {
      filter.$text = {
        $search: search,
      };
    }

    const hospitals = await Hospital.find(
      filter
    )
      .sort({ createdAt: -1 })
      .select("-documents");

    return res.status(200).json(
      new ApiResponse(
        200,
        hospitals,
        "Hospitals fetched successfully"
      )
    );
  }
);

// ==========================================
// GET HOSPITAL BY ID
// ==========================================

const getHospitalById = asyncHandler(
  async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(
        400,
        "Invalid hospital ID"
      );
    }

    const hospital = await Hospital.findOne({
      _id: id,
      isDeleted: false,
    }).select("-documents");

    if (!hospital) {
      throw new ApiError(
        404,
        "Hospital not found"
      );
    }

    return res.status(200).json(
      new ApiResponse(
        200,
        hospital,
        "Hospital fetched successfully"
      )
    );
  }
);

// ==========================================
// UPDATE HOSPITAL
// ==========================================

const updateHospital = asyncHandler(
  async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(
        400,
        "Invalid hospital ID"
      );
    }

    const hospital = await Hospital.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!hospital) {
      throw new ApiError(
        404,
        "Hospital not found"
      );
    }

    const updates = {
      ...req.body,
      updatedBy: req.user._id,
    };

    delete updates._id;
    delete updates.createdBy;
    delete updates.isDeleted;

    if (updates.hospitalCode) {
      updates.hospitalCode =
        updates.hospitalCode
          .toUpperCase()
          .trim();
    }

    const updatedHospital =
      await Hospital.findByIdAndUpdate(
        id,
        { $set: updates },
        {
          new: true,
          runValidators: true,
        }
      ).select("-documents");

    return res.status(200).json(
      new ApiResponse(
        200,
        updatedHospital,
        "Hospital updated successfully"
      )
    );
  }
);

// ==========================================
// DELETE HOSPITAL
// ==========================================

const deleteHospital = asyncHandler(
  async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(
        400,
        "Invalid hospital ID"
      );
    }

    const hospital = await Hospital.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!hospital) {
      throw new ApiError(
        404,
        "Hospital not found"
      );
    }

    hospital.isDeleted = true;
    hospital.status = "Inactive";
    hospital.updatedBy = req.user._id;

    await hospital.save();

    return res.status(200).json(
      new ApiResponse(
        200,
        null,
        "Hospital deleted successfully"
      )
    );
  }
);

// ==========================================
// EXPORTS
// ==========================================

export {
  createHospital,
  getAllHospitals,
  getHospitalById,
  updateHospital,
  deleteHospital,
};