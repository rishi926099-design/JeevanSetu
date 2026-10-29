import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import Doctor from "../models/Doctor.js";
import Hospital from "../models/Hospital.js";
import Department from "../models/Department.js";
import Specialization from "../models/Specialization.js";

// ==========================================
// SEARCH DOCTORS
// ==========================================

const searchDoctors = asyncHandler(async (req, res) => {
  const { q, specialization, hospital } = req.query;

  const filter = {};

  if (q) {
    filter.$or = [
      { name: { $regex: q, $options: "i" } },
      { email: { $regex: q, $options: "i" } },
    ];
  }

  if (specialization) {
    filter.specialization = specialization;
  }

  if (hospital) {
    filter.hospital = hospital;
  }

  const doctors = await Doctor.find(filter)
    .populate("hospital")
    .populate("specialization")
    .limit(50);

  return res.status(200).json(
    new ApiResponse(
      200,
      doctors,
      "Doctors fetched successfully"
    )
  );
});

// ==========================================
// SEARCH HOSPITALS
// ==========================================

const searchHospitals = asyncHandler(async (req, res) => {
  const { q, city, state } = req.query;

  const filter = {};

  if (q) {
    filter.$or = [
      { name: { $regex: q, $options: "i" } },
      { email: { $regex: q, $options: "i" } },
    ];
  }

  if (city) {
    filter.city = {
      $regex: city,
      $options: "i",
    };
  }

  if (state) {
    filter.state = {
      $regex: state,
      $options: "i",
    };
  }

  const hospitals = await Hospital.find(filter)
    .limit(50);

  return res.status(200).json(
    new ApiResponse(
      200,
      hospitals,
      "Hospitals fetched successfully"
    )
  );
});

// ==========================================
// SEARCH DEPARTMENTS
// ==========================================

const searchDepartments = asyncHandler(async (req, res) => {
  const { q, hospital } = req.query;

  const filter = {};

  if (q) {
    filter.name = {
      $regex: q,
      $options: "i",
    };
  }

  if (hospital) {
    filter.hospital = hospital;
  }

  const departments = await Department.find(filter)
    .populate("hospital")
    .populate("headOfDepartment")
    .limit(50);

  return res.status(200).json(
    new ApiResponse(
      200,
      departments,
      "Departments fetched successfully"
    )
  );
});

// ==========================================
// SEARCH SPECIALIZATIONS
// ==========================================

const searchSpecializations = asyncHandler(
  async (req, res) => {
    const { q, department } = req.query;

    const filter = {};

    if (q) {
      filter.name = {
        $regex: q,
        $options: "i",
      };
    }

    if (department) {
      filter.department = department;
    }

    const specializations =
      await Specialization.find(filter)
        .populate("department")
        .limit(50);

    return res.status(200).json(
      new ApiResponse(
        200,
        specializations,
        "Specializations fetched successfully"
      )
    );
  }
);

export {
  searchDoctors,
  searchHospitals,
  searchDepartments,
  searchSpecializations,
};