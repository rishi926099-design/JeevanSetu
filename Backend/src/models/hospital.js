import mongoose from "mongoose";

const { Schema, model } = mongoose;

/* -------------------------------------------------------------------------- */
/*                              Nested Schemas                                */
/* -------------------------------------------------------------------------- */

// Contact Information
const contactSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      match: [/^[0-9+\-\s()]{7,20}$/, "Please enter a valid phone number"],
    },
    emergencyContact: {
      type: String,
      trim: true,
      default: "",
    },
    website: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { _id: false },
);

// Address
const addressSchema = new Schema(
  {
    building: {
      type: String,
      trim: true,
      default: "",
    },
    street: {
      type: String,
      trim: true,
      default: "",
    },
    area: {
      type: String,
      trim: true,
      default: "",
    },
    landmark: {
      type: String,
      trim: true,
      default: "",
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    district: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
      default: "India",
    },
    pincode: {
      type: String,
      required: true,
      trim: true,
      match: [/^[0-9]{4,10}$/, "Invalid pincode"],
    },
  },
  { _id: false },
);

// Geo Location
const geoLocationSchema = new Schema(
  {
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [0, 0],
      },
    },
    latitude: {
      type: Number,
      min: -90,
      max: 90,
      default: 0,
    },
    longitude: {
      type: Number,
      min: -180,
      max: 180,
      default: 0,
    },
  },
  { _id: false },
);

// Capacity
const capacitySchema = new Schema(
  {
    totalBeds: {
      type: Number,
      default: 0,
      min: 0,
    },
    availableBeds: {
      type: Number,
      default: 0,
      min: 0,
    },
    icuBeds: {
      type: Number,
      default: 0,
      min: 0,
    },
    emergencyBeds: {
      type: Number,
      default: 0,
      min: 0,
    },
    ventilators: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { _id: false },
);

// Working Hours
const workingHoursSchema = new Schema(
  {
    openingTime: {
      type: String,
      default: "09:00",
    },
    closingTime: {
      type: String,
      default: "18:00",
    },
    workingDays: {
      type: [
        {
          type: String,
          enum: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
        },
      ],
      default: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
    },
    open24x7: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false },
);

// Emergency Services
const emergencySchema = new Schema(
  {
    emergencyAvailable: {
      type: Boolean,
      default: true,
    },
    ambulanceAvailable: {
      type: Boolean,
      default: true,
    },
    traumaCenter: {
      type: Boolean,
      default: false,
    },
    bloodBank: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false },
);

// AI Features
const aiFeaturesSchema = new Schema(
  {
    aiReportSummary: {
      type: Boolean,
      default: true,
    },
    oneClickReferral: {
      type: Boolean,
      default: true,
    },
    ocrSupport: {
      type: Boolean,
      default: true,
    },
    telemedicineSupport: {
      type: Boolean,
      default: true,
    },
    voiceInputSupport: {
      type: Boolean,
      default: true,
    },
  },
  { _id: false },
);

// Verification
const verificationSchema = new Schema(
  {
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationStatus: {
      type: String,
      enum: ["Pending", "Verified", "Rejected"],
      default: "Pending",
    },
    verifiedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    verifiedAt: {
      type: Date,
      default: null,
    },
  },
  { _id: false },
);

// Ratings
const ratingSchema = new Schema(
  {
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { _id: false },
);

// Documents
const documentsSchema = new Schema(
  {
    registrationCertificate: {
      type: String,
      trim: true,
      default: "",
    },
    hospitalLicense: {
      type: String,
      trim: true,
      default: "",
    },
    nabhCertificate: {
      type: String,
      trim: true,
      default: "",
    },
    governmentApproval: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { _id: false },
);

/* -------------------------------------------------------------------------- */
/*                              Hospital Schema                               */
/* -------------------------------------------------------------------------- */

const hospitalSchema = new Schema(
  {
    // ===========================
    // Basic Information
    // ===========================

    hospitalName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
      index: true,
    },

    hospitalCode: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      unique: true,
    },

    registrationNumber: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      unique: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 3000,
      default: "",
    },

    logo: {
      type: String,
      default: "",
    },

    // Contact
    contact: contactSchema,

    // Address
    address: addressSchema,

    // Geo Location
    geoLocation: geoLocationSchema,

    // Hospital Details
    hospitalType: {
      type: String,
      enum: [
        "General",
        "Speciality",
        "Multi Speciality",
        "Super Speciality",
        "Clinic",
        "Medical College",
      ],
      required: true,
    },

    ownership: {
      type: String,
      enum: ["Government", "Private", "Trust"],
      required: true,
    },

    departments: [
      {
        type: String,
        trim: true,
      },
    ],

    specializations: [
      {
        type: String,
        trim: true,
      },
    ],

    facilities: [
      {
        type: String,
        trim: true,
      },
    ],

    services: [
      {
        type: String,
        trim: true,
      },
    ],

    // Capacity
    capacity: capacitySchema,

    // Working Hours
    workingHours: workingHoursSchema,

    // Emergency
    emergencyServices: emergencySchema,

    // AI Features
    aiFeatures: aiFeaturesSchema,

    // References
    doctors: [
      {
        type: Schema.Types.ObjectId,
        ref: "Doctor",
      },
    ],

    patients: [
      {
        type: Schema.Types.ObjectId,
        ref: "Patient",
      },
    ],

    appointments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Appointment",
      },
    ],

    referrals: [
      {
        type: Schema.Types.ObjectId,
        ref: "Referral",
      },
    ],

    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],

    // Verification
    verification: verificationSchema,

    // Ratings
    ratings: ratingSchema,

    // Documents
    documents: documentsSchema,

    // Status
    status: {
      type: String,
      enum: ["Active", "Inactive", "Suspended"],
      default: "Active",
    },

    // Soft Delete
    isDeleted: {
      type: Boolean,
      default: false,
    },

    // Audit
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

/* -------------------------------------------------------------------------- */
/*                                  Indexes                                   */
/* -------------------------------------------------------------------------- */

// Geo Search
hospitalSchema.index({ "geoLocation.location": "2dsphere" });

// Search
hospitalSchema.index({
  hospitalName: "text",
  description: "text",
});

// Performance Indexes
hospitalSchema.index({ hospitalCode: 1 });
hospitalSchema.index({ registrationNumber: 1 });
hospitalSchema.index({ "address.city": 1, "address.state": 1 });
hospitalSchema.index({ hospitalType: 1 });
hospitalSchema.index({ ownership: 1 });
hospitalSchema.index({ status: 1 });
hospitalSchema.index({ isDeleted: 1 });
hospitalSchema.index({ "ratings.averageRating": -1 });

export default model("Hospital", hospitalSchema);
