import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Department from "../models/Department.js";

// CREATE
const createDepartment = asyncHandler(async (req, res) => {
  const {
    name,
    code,
    description,
    hospital,
    headOfDepartment,
  } = req.body;

  if (!name || !code || !hospital) {
    throw new ApiError(
      400,
      "Name, code and hospital are required"
    );
  }

  const existingDepartment = await Department.findOne({
    hospital,
    code: code.toUpperCase(),
  });

  if (existingDepartment) {
    throw new ApiError(
      409,
      "Department with this code already exists in this hospital"
    );
  }

  const department = await Department.create({
    name,
    code,
    description,
    hospital,
    headOfDepartment,
  });

  return res.status(201).json(
    new ApiResponse(
      201,
      department,
      "Department created successfully"
    )
  );
});

// GET ALL
const getAllDepartments = asyncHandler(async (req, res) => {
  const filter = {};

  if (req.query.hospital) {
    filter.hospital = req.query.hospital;
  }

  if (req.query.isActive !== undefined) {
    filter.isActive = req.query.isActive === "true";
  }

  const departments = await Department.find(filter)
    .populate("hospital")
    .populate("headOfDepartment")
    .sort({ name: 1 });

  return res.status(200).json(
    new ApiResponse(
      200,
      departments,
      "Departments fetched successfully"
    )
  );
});

// GET BY ID
const getDepartmentById = asyncHandler(async (req, res) => {
  const department = await Department.findById(req.params.id)
    .populate("hospital")
    .populate("headOfDepartment");

  if (!department) {
    throw new ApiError(404, "Department not found");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      department,
      "Department fetched successfully"
    )
  );
});

// UPDATE
const updateDepartment = asyncHandler(async (req, res) => {
  const allowedFields = [
    "name",
    "code",
    "description",
    "headOfDepartment",
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

  const department = await Department.findByIdAndUpdate(
    req.params.id,
    { $set: updateData },
    {
      new: true,
      runValidators: true,
    }
  )
    .populate("hospital")
    .populate("headOfDepartment");

  if (!department) {
    throw new ApiError(404, "Department not found");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      department,
      "Department updated successfully"
    )
  );
});

// DELETE
const deleteDepartment = asyncHandler(async (req, res) => {
  const department = await Department.findByIdAndDelete(
    req.params.id
  );

  if (!department) {
    throw new ApiError(404, "Department not found");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      null,
      "Department deleted successfully"
    )
  );
});

export {
  createDepartment,
  getAllDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
};