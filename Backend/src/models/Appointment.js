import mongoose from "mongoose";

const { Schema, model } = mongoose;

const appointmentSchema = new Schema(
  {
    patient: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
      index: true,
    },

    doctor: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
      index: true,
    },

    hospital: {
      type: Schema.Types.ObjectId,
      ref: "Hospital",
      required: true,
      index: true,
    },

    department: {
      type: Schema.Types.ObjectId,
      ref: "Department",
      default: null,
    },

    specialization: {
      type: Schema.Types.ObjectId,
      ref: "Specialization",
      default: null,
    },

    appointmentDate: {
      type: Date,
      required: true,
      index: true,
    },

    startTime: {
      type: String,
      required: true,
      trim: true,
    },

    endTime: {
      type: String,
      required: true,
      trim: true,
    },

    reason: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

    symptoms: {
      type: [String],
      default: [],
    },

    notes: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: "",
    },

    appointmentType: {
      type: String,
      enum: ["In-Person", "Online", "Emergency"],
      default: "In-Person",
    },

    status: {
      type: String,
      enum: [
        "Scheduled",
        "Confirmed",
        "Completed",
        "Cancelled",
        "Rejected",
        "No-Show",
      ],
      default: "Scheduled",
      index: true,
    },

    cancellationReason: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },

    cancelledAt: {
      type: Date,
      default: null,
    },

    meetingLink: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

appointmentSchema.index({
  doctor: 1,
  appointmentDate: 1,
});

appointmentSchema.index({
  patient: 1,
  appointmentDate: 1,
});

appointmentSchema.index({
  hospital: 1,
  appointmentDate: 1,
});

appointmentSchema.index({
  status: 1,
  appointmentDate: 1,
});

const Appointment = model("Appointment", appointmentSchema);

export default Appointment;