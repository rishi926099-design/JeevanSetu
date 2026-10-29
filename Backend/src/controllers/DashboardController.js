import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

import { MedicalRecord } from "../models/MedicalRecord.js";
import { Prescription } from "../models/Prescription.js";
import { Referral } from "../models/Referral.js";
import Appointment from "../models/Appointment.js";
import Notification from "../models/Notification.js";


// ==========================================
// PATIENT DASHBOARD
// ==========================================

const getPatientDashboard = asyncHandler(async (req, res) => {
  const patientId = req.user.profileId;

  const [
    totalMedicalRecords,
    totalPrescriptions,
    totalReferrals,
    totalAppointments,
    upcomingAppointments,
    unreadNotifications,
  ] = await Promise.all([
    MedicalRecord.countDocuments({
      patient: patientId,
    }),

    Prescription.countDocuments({
      patient: patientId,
    }),

    Referral.countDocuments({
      patient: patientId,
    }),

    Appointment.countDocuments({
      patient: patientId,
    }),

    Appointment.find({
      patient: patientId,
      appointmentDate: {
        $gte: new Date(),
      },
      status: {
        $in: ["Scheduled", "Confirmed"],
      },
    })
      .populate("doctor")
      .populate("hospital")
      .sort({
        appointmentDate: 1,
      })
      .limit(5),

    Notification.countDocuments({
      recipient: req.user._id,
      isRead: false,
    }),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalMedicalRecords,
        totalPrescriptions,
        totalReferrals,
        totalAppointments,
        upcomingAppointments,
        unreadNotifications,
      },
      "Patient dashboard fetched successfully"
    )
  );
});


// ==========================================
// DOCTOR DASHBOARD
// ==========================================

const getDoctorDashboard = asyncHandler(async (req, res) => {
  const doctorId = req.user.profileId;

  const [
    totalMedicalRecords,
    totalPrescriptions,
    totalReferrals,
    totalAppointments,
    todayAppointments,
    upcomingAppointments,
    unreadNotifications,
  ] = await Promise.all([
    MedicalRecord.countDocuments({
      doctor: doctorId,
    }),

    Prescription.countDocuments({
      doctor: doctorId,
    }),

    Referral.countDocuments({
      referredByDoctor: doctorId,
    }),

    Appointment.countDocuments({
      doctor: doctorId,
    }),

    Appointment.find({
      doctor: doctorId,
      appointmentDate: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
        $lt: new Date(new Date().setHours(23, 59, 59, 999)),
      },
      status: {
        $in: ["Scheduled", "Confirmed"],
      },
    })
      .populate("patient")
      .populate("hospital")
      .sort({
        startTime: 1,
      }),

    Appointment.find({
      doctor: doctorId,
      appointmentDate: {
        $gte: new Date(),
      },
      status: {
        $in: ["Scheduled", "Confirmed"],
      },
    })
      .populate("patient")
      .populate("hospital")
      .sort({
        appointmentDate: 1,
      })
      .limit(5),

    Notification.countDocuments({
      recipient: req.user._id,
      isRead: false,
    }),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalMedicalRecords,
        totalPrescriptions,
        totalReferrals,
        totalAppointments,
        todayAppointments,
        upcomingAppointments,
        unreadNotifications,
      },
      "Doctor dashboard fetched successfully"
    )
  );
});


// ==========================================
// HOSPITAL ADMIN DASHBOARD
// ==========================================

const getHospitalAdminDashboard = asyncHandler(
  async (req, res) => {
    const hospitalId = req.user.profileId;

    const [
      totalMedicalRecords,
      totalPrescriptions,
      totalReferrals,
      totalAppointments,
      todayAppointments,
      unreadNotifications,
    ] = await Promise.all([
      MedicalRecord.countDocuments({
        hospital: hospitalId,
      }),

      Prescription.countDocuments({
        hospital: hospitalId,
      }),

      Referral.countDocuments({
        $or: [
          {
            referredFromHospital: hospitalId,
          },
          {
            referredToHospital: hospitalId,
          },
        ],
      }),

      Appointment.countDocuments({
        hospital: hospitalId,
      }),

      Appointment.find({
        hospital: hospitalId,
        appointmentDate: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0)),
          $lt: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      })
        .populate("patient")
        .populate("doctor")
        .sort({
          startTime: 1,
        }),

      Notification.countDocuments({
        recipient: req.user._id,
        isRead: false,
      }),
    ]);

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          totalMedicalRecords,
          totalPrescriptions,
          totalReferrals,
          totalAppointments,
          todayAppointments,
          unreadNotifications,
        },
        "Hospital admin dashboard fetched successfully"
      )
    );
  }
);


// ==========================================
// SUPER ADMIN DASHBOARD
// ==========================================

const getSuperAdminDashboard = asyncHandler(
  async (req, res) => {
    const [
      totalMedicalRecords,
      totalPrescriptions,
      totalReferrals,
      totalAppointments,
      pendingReferrals,
      unreadNotifications,
    ] = await Promise.all([
      MedicalRecord.countDocuments(),

      Prescription.countDocuments(),

      Referral.countDocuments(),

      Appointment.countDocuments(),

      Referral.countDocuments({
        referralStatus: "Pending",
      }),

      Notification.countDocuments({
        recipient: req.user._id,
        isRead: false,
      }),
    ]);

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          totalMedicalRecords,
          totalPrescriptions,
          totalReferrals,
          totalAppointments,
          pendingReferrals,
          unreadNotifications,
        },
        "Super admin dashboard fetched successfully"
      )
    );
  }
);


export {
  getPatientDashboard,
  getDoctorDashboard,
  getHospitalAdminDashboard,
  getSuperAdminDashboard,
};