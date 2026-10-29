import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Appointment from "../models/Appointment.js";

// CREATE APPOINTMENT
const createAppointment = asyncHandler(async (req, res) => {
  const {
    patient,
    doctor,
    hospital,
    department,
    specialization,
    appointmentDate,
    startTime,
    endTime,
    reason,
    symptoms,
    notes,
    appointmentType,
    meetingLink,
  } = req.body;

  if (
    !patient ||
    !doctor ||
    !hospital ||
    !appointmentDate ||
    !startTime ||
    !endTime ||
    !reason
  ) {
    throw new ApiError(
      400,
      "Patient, doctor, hospital, date, time and reason are required"
    );
  }

  const appointment = await Appointment.create({
    patient,
    doctor,
    hospital,
    department,
    specialization,
    appointmentDate,
    startTime,
    endTime,
    reason,
    symptoms,
    notes,
    appointmentType,
    meetingLink,
  });

  return res.status(201).json(
    new ApiResponse(
      201,
      appointment,
      "Appointment created successfully"
    )
  );
});

// GET ALL APPOINTMENTS
const getAllAppointments = asyncHandler(async (req, res) => {
  const filter = {};

  if (req.user.role === "patient") {
    filter.patient = req.user.profileId;
  }

  if (req.user.role === "doctor") {
    filter.doctor = req.user.profileId;
  }

  if (req.user.role === "hospitalAdmin") {
    filter.hospital = req.user.profileId;
  }

  if (req.query.status) {
    filter.status = req.query.status;
  }

  if (req.query.date) {
    filter.appointmentDate = new Date(req.query.date);
  }

  const appointments = await Appointment.find(filter)
    .populate("patient")
    .populate("doctor")
    .populate("hospital")
    .populate("department")
    .populate("specialization")
    .sort({ appointmentDate: 1, startTime: 1 });

  return res.status(200).json(
    new ApiResponse(
      200,
      appointments,
      "Appointments fetched successfully"
    )
  );
});

// GET APPOINTMENT BY ID
const getAppointmentById = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id)
    .populate("patient")
    .populate("doctor")
    .populate("hospital")
    .populate("department")
    .populate("specialization");

  if (!appointment) {
    throw new ApiError(404, "Appointment not found");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      appointment,
      "Appointment fetched successfully"
    )
  );
});

// UPDATE APPOINTMENT
const updateAppointment = asyncHandler(async (req, res) => {
  const allowedFields = [
    "appointmentDate",
    "startTime",
    "endTime",
    "reason",
    "symptoms",
    "notes",
    "appointmentType",
    "status",
    "meetingLink",
    "cancellationReason",
  ];

  const updateData = {};

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updateData[field] = req.body[field];
    }
  });

  if (updateData.status === "Cancelled") {
    updateData.cancelledAt = new Date();
  }

  const appointment = await Appointment.findByIdAndUpdate(
    req.params.id,
    { $set: updateData },
    {
      new: true,
      runValidators: true,
    }
  )
    .populate("patient")
    .populate("doctor")
    .populate("hospital")
    .populate("department")
    .populate("specialization");

  if (!appointment) {
    throw new ApiError(404, "Appointment not found");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      appointment,
      "Appointment updated successfully"
    )
  );
});

// CANCEL APPOINTMENT
const cancelAppointment = asyncHandler(async (req, res) => {
  const { cancellationReason } = req.body;

  const appointment = await Appointment.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        status: "Cancelled",
        cancellationReason:
          cancellationReason || "Appointment cancelled",
        cancelledAt: new Date(),
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!appointment) {
    throw new ApiError(404, "Appointment not found");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      appointment,
      "Appointment cancelled successfully"
    )
  );
});

// DELETE APPOINTMENT
const deleteAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findByIdAndDelete(
    req.params.id
  );

  if (!appointment) {
    throw new ApiError(404, "Appointment not found");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      null,
      "Appointment deleted successfully"
    )
  );
});

export {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointment,
  cancelAppointment,
  deleteAppointment,
};