import mongoose from "mongoose";
const specializationSchema = new mongoose.Schema(
  {
    //name of medical specialization
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
      unique: true,
    },

    //detail about specialization
    description: {
      type: String,
      trim: true,
      maxlength: 300,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
      index: true,
    },
    //control the spcialization is available or not
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
const Specialization = mongoose.model("Specialization", specializationSchema);
