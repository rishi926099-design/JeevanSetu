import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import EmergencyContact from "../models/EmergencyContact.js";

// CREATE
const createEmergencyContact = asyncHandler(async (req, res) => {
  const {
    patient,
    name,
    relationship,
    phone,
    alternatePhone,
    email,
    address,
    isPrimary,
  } = req.body;

  if (!patient || !name || !relationship || !phone) {
    throw new ApiError(
      400,
      "Patient, name, relationship and phone are required"
    );
  }

  if (isPrimary === true) {
    await EmergencyContact.updateMany(
      { patient, isPrimary: true },
      { $set: { isPrimary: false } }
    );
  }

  const contact = await EmergencyContact.create({
    patient,
    name,
    relationship,
    phone,
    alternatePhone,
    email,
    address,
    isPrimary,
  });

  return res.status(201).json(
    new ApiResponse(
      201,
      contact,
      "Emergency contact created successfully"
    )
  );
});

// GET ALL
const getAllEmergencyContacts = asyncHandler(async (req, res) => {
  const filter = {};

  if (req.query.patient) {
    filter.patient = req.query.patient;
  }

  if (req.query.isActive !== undefined) {
    filter.isActive = req.query.isActive === "true";
  }

  const contacts = await EmergencyContact.find(filter)
    .populate("patient")
    .sort({ isPrimary: -1, createdAt: -1 });

  return res.status(200).json(
    new ApiResponse(
      200,
      contacts,
      "Emergency contacts fetched successfully"
    )
  );
});

// GET BY ID
const getEmergencyContactById = asyncHandler(async (req, res) => {
  const contact = await EmergencyContact.findById(
    req.params.id
  ).populate("patient");

  if (!contact) {
    throw new ApiError(404, "Emergency contact not found");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      contact,
      "Emergency contact fetched successfully"
    )
  );
});

// GET BY PATIENT
const getEmergencyContactsByPatient = asyncHandler(
  async (req, res) => {
    const contacts = await EmergencyContact.find({
      patient: req.params.patientId,
      isActive: true,
    })
      .populate("patient")
      .sort({ isPrimary: -1, createdAt: -1 });

    return res.status(200).json(
      new ApiResponse(
        200,
        contacts,
        "Patient emergency contacts fetched successfully"
      )
    );
  }
);

// UPDATE
const updateEmergencyContact = asyncHandler(async (req, res) => {
  const allowedFields = [
    "name",
    "relationship",
    "phone",
    "alternatePhone",
    "email",
    "address",
    "isPrimary",
    "isActive",
  ];

  const updateData = {};

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updateData[field] = req.body[field];
    }
  });

  const existingContact = await EmergencyContact.findById(
    req.params.id
  );

  if (!existingContact) {
    throw new ApiError(404, "Emergency contact not found");
  }

  if (updateData.isPrimary === true) {
    await EmergencyContact.updateMany(
      {
        patient: existingContact.patient,
        _id: { $ne: existingContact._id },
        isPrimary: true,
      },
      { $set: { isPrimary: false } }
    );
  }

  const contact = await EmergencyContact.findByIdAndUpdate(
    req.params.id,
    { $set: updateData },
    {
      new: true,
      runValidators: true,
    }
  ).populate("patient");

  return res.status(200).json(
    new ApiResponse(
      200,
      contact,
      "Emergency contact updated successfully"
    )
  );
});

// DELETE
const deleteEmergencyContact = asyncHandler(async (req, res) => {
  const contact = await EmergencyContact.findByIdAndDelete(
    req.params.id
  );

  if (!contact) {
    throw new ApiError(404, "Emergency contact not found");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      null,
      "Emergency contact deleted successfully"
    )
  );
});

export {
  createEmergencyContact,
  getAllEmergencyContacts,
  getEmergencyContactById,
  getEmergencyContactsByPatient,
  updateEmergencyContact,
  deleteEmergencyContact,
};