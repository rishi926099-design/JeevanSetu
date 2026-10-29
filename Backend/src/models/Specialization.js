import mongoose from "mongoose";

const { Schema, model } = mongoose;

const specializationSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    code: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      maxlength: 20,
      index: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },

    department: {
      type: Schema.Types.ObjectId,
      ref: "Department",
      required: true,
      index: true,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

specializationSchema.index(
  { department: 1, name: 1 },
  { unique: true }
);

specializationSchema.index(
  { department: 1, code: 1 },
  { unique: true }
);

const Specialization = model(
  "Specialization",
  specializationSchema
);

export default Specialization;