import Appointment from "../models/Appointment.js";
import asyncHandler from "../utils/asyncHandler.js";
// asyncHandler automatically catch the error and  make code clean and easy

// Create Appointment
export const createAppointment = asyncHandler(async (req, res) => {

    const appointment = await Appointment.create(req.body);

    res.status(201).json({
        message: "Appointment created",
        appointment
    });
});


// Get All Appointments
export const getAppointments = asyncHandler(async (req, res) => {

    const appointments = await Appointment.find();

    res.json(appointments);
});


// Update Appointment
export const updateAppointment = asyncHandler(async (req, res) => {

    const appointment = await Appointment.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new:true}
    );

    res.json(appointment);
});


// Delete Appointment
export const deleteAppointment = asyncHandler(async(req,res)=>{

    await Appointment.findByIdAndDelete(req.params.id);

    res.json({
        message:"Appointment deleted"
    });

});