import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Specialization from "../models/Specialization.js";

// CREATE
const createSpecialization = asyncHandler(async (req, res) => {
  const {
    name,
    code,
    description,
    department,
  } = req.body;

  if (!name || !code || !department) {
    throw new ApiError(
      400,
      "Name, code and department are required"
    );
  }

  const existing = await Specialization.findOne({
    department,
    code: code.toUpperCase(),
  });

  if (existing) {
    throw new ApiError(
      409,
      "Specialization with this code already exists in this department"
    );
  }

  const specialization = await Specialization.create({
    name,
    code,
    description,
    department,
  });

  return res.status(201).json(
    new ApiResponse(
      201,
      specialization,
      "Specialization created successfully"
    )
  );
});

// GET ALL
const getAllSpecializations = asyncHandler(async (req, res) => {
  const filter = {};

  if (req.query.department) {
    filter.department = req.query.department;
  }

  if (req.query.isActive !== undefined) {
    filter.isActive = req.query.isActive === "true";
  }

  const specializations = await Specialization.find(filter)
    .populate("department")
    .sort({ name: 1 });

  return res.status(200).json(
    new ApiResponse(
      200,
      specializations,
      "Specializations fetched successfully"
    )
  );
});

// GET BY ID
const getSpecializationById = asyncHandler(async (req, res) => {
  const specialization = await Specialization.findById(
    req.params.id
  ).populate("department");

  if (!specialization) {
    throw new ApiError(404, "Specialization not found");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      specialization,
      "Specialization fetched successfully"
    )
  );
});

// UPDATE
const updateSpecialization = asyncHandler(async (req, res) => {
  const allowedFields = [
    "name",
    "code",
    "description",
    "department",
    "isActive",
  ];

  const updateData = {};

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updateData[field] =
        field === "code"
          ? req.body[field].toUpperCase()
          : req.body[field];
    }
  });

  const specialization =
    await Specialization.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      {
        new: true,
        runValidators: true,
      }
    ).populate("department");

  if (!specialization) {
    throw new ApiError(404, "Specialization not found");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      specialization,
      "Specialization updated successfully"
    )
  );
});

// DELETE
const deleteSpecialization = asyncHandler(async (req, res) => {
  const specialization =
    await Specialization.findByIdAndDelete(req.params.id);

  if (!specialization) {
    throw new ApiError(404, "Specialization not found");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      null,
      "Specialization deleted successfully"
    )
  );
});

export {
  createSpecialization,
  getAllSpecializations,
  getSpecializationById,
  updateSpecialization,
  deleteSpecialization,
};