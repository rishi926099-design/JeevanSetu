import mongoose from "mongoose";
const notificationSchema = new mongoose.Schema({
    recipient:{
        type:mongoose.Schema.Types.ObjectId,
          ref:"User",
    },
     sender:{
        type:mongoose.Schema.Types.ObjectId,
          ref:"User",
          required:true,
          
    },
    //sub of notification
      title :{
        type:String,
          required:true,
          trim:true,
          maxlength:100
           },
           message :{
        type:String,
          required:true,
          trim:true,
          maxlength:400
           },
            type: {
        type: String,
        required: true,
        enum: [
            "Appointment",
            "Prescription",
            "Medical Report",
            "Payment",
            "Reminder",
            "Emergency",
            "General"
        ]
    },
     priority: {
        type: String,
        enum: [
            "Low",
            "Medium",
            "High"
        ],
        default: "Medium"
    },
    //tell that notification belong to which record
    relatedId: {
    type: mongoose.Schema.Types.ObjectId
}
},
{
    timestamps:true
}
);
export const Notification = mongoose.model(
    "Notification",
    notificationSchema
);