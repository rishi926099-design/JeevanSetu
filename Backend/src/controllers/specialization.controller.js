import Specialization from "../models/Specialization.js";
import asyncHandler from "../utils/asyncHandler.js";


// Create Specialization
export const createSpecialization = asyncHandler(async (req, res) => {

    const specialization = await Specialization.create(req.body);

    res.status(201).json({
        message: "Specialization created successfully",
        specialization
    });

});


// Get All Specializations
export const getSpecializations = asyncHandler(async (req, res) => {

    const specializations = await Specialization.find();

    res.status(200).json(specializations);

});


// Get Single Specialization
export const getSpecializationById = asyncHandler(async (req, res) => {

    const specialization = await Specialization.findById(req.params.id);

    res.status(200).json(specialization);

});


// Update Specialization
export const updateSpecialization = asyncHandler(async (req, res) => {

    const specialization = await Specialization.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );

    res.status(200).json({
        message: "Specialization updated successfully",
        specialization
    });

});


// Delete Specialization
export const deleteSpecialization = asyncHandler(async (req, res) => {

    await Specialization.findByIdAndDelete(req.params.id);
       
    res.status(200).json({
        message: "Specialization deleted successfully"
    });

});