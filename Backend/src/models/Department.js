import mongoose from "mongoose";

const { Schema, model } = mongoose;

const departmentSchema = new Schema(
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
      unique: true,
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

    hospital: {
      type: Schema.Types.ObjectId,
      ref: "Hospital",
      required: true,
      index: true,
    },

    headOfDepartment: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
      default: null,
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

departmentSchema.index({ hospital: 1, name: 1 });
departmentSchema.index({ hospital: 1, code: 1 }, { unique: true });

const Department = model("Department", departmentSchema);

export default Department;