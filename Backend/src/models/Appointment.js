import mongoose from "mongoose";
const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
      index: true,
    },

    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
      index: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
    },
    appointmentDate: {
      type: Date,
      required: true,
    },

    appointmentTime: {
      type: String,
      required: true,
    },
    appointmentNumber: {
      type: Number,
      unique: true,
    },
    appointmentFee: {
      type: Number,
      default: 200,
      min: 0,
    },

    roomNumber: {
      type: String,
    },

    consultationType: {
      type: String,
      enum: ["Online", "In-Person"],
      default: "In-Person",
    },
    reason: {
      type: String,
      required: true,
    },
    // store the date and time when the patient arrive the hospital and checked in
    checkedInAt: {
      type: Date,
    },
    medicalRecord: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MedicalRecord",
    },
    symptoms: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Completed", "Cancelled"],
      default: "Pending",
    },

    //for emergency cases
    priority: {
      type: String,
      enum: ["Normal", "High", "Emergency"],
      default: "Normal",
    },
    //dr diagnosis after consultation
    diagnosis: {
      type: String,
    },

    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Appointment = mongoose.model("Appointment", appointmentSchema);
