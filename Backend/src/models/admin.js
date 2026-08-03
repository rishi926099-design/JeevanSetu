// Import MedicalRecord model
import { MedicalRecord } from "../models/MedicalRecord.js";

// ================================
// Create New Medical Record
// Purpose:
// Create a new medical record for a patient
// ================================
export const createMedicalRecord = async (req, res) => {
  try {
    // Extract request body
    const data = req.body;

    // Create record in MongoDB
    const record = await MedicalRecord.create(data);

    // Return success response
    return res.status(201).json({
      success: true,
      message: "Medical Record created successfully",
      data: record,
    });
  } catch (error) {
    // Handle server error
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
