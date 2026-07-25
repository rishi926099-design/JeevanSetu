import mongoose from "mongoose";
const emergencycontactSchema = new mongoose.Schema(
    {
      patient:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
        required: true,
        index:true
      },
      fullName:{
        type: String,
        trim: true,
        required: true,
        maxlength:50
      },
      relation:{
        type: String,
        required: true,
        enum:[
            "Father",
            "Mother",
            "Brother",
            "Son",
            "Daughter",
            "Guardian",
            "Friend",
            "Relative",
            "Other"
         ]
         },
         phoneNumber:{
            type: String,
            required:true,
    
            trim: true
         },
    alternatePhoneNumber: {
        type: String,
        trim: true
    },
    email:{
        type:String,
        lowercase:true,
        trim:true
    },
    address:{
        type:String,
        trim:true,
        maxlength:100

    },
    city:{
        type:String,
        trim:true
 },
  state: {
        type: String,
        trim: true
    },

    country: {
        type: String,
        default: "India"
    },
      canMakeMedicalDecisions: {
        type: Boolean,
        default: false
    },

    isActive: {
        type: Boolean,
        default: true
    }
},
    {
        timestamps:true
    }
);

export const EmergencyContact= mongoose.model("EmergencyContact",emergencycontactSchema);

