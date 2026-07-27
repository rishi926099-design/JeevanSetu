import { Prescription } from "../models/Prescription.js";

/**
 * ============================================================
 * @Controller Prescription Controller
 * @Purpose Handle all Prescription related APIs
 * ============================================================
 */

/**
 * ============================================================
 * @Route   POST /api/v1/prescriptions
 * @Desc    Create a new prescription
 * @Access  Private (Doctor/Admin)
 * ============================================================
 */
export const createPrescription = async (req, res) => {
  try {
    // Extract data sent from frontend
    const prescriptionData = req.body;

    // Create prescription in MongoDB
    const prescription = await Prescription.create(prescriptionData);

    return res.status(201).json({
      success: true,
      message: "Prescription created successfully.",
      data: prescription,
    });
  } catch (error) {
    console.error("Create Prescription Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create prescription.",
      error: error.message,
    });
  }
};

/**
 * ============================================================
 * @Route   GET /api/v1/prescriptions
 * @Desc    Get all prescriptions
 * @Access  Private
 * ============================================================
 */
export const getAllPrescriptions = async (req, res) => {
  try {
    // Fetch all prescriptions and populate related information
    const prescriptions = await Prescription.find()
      .populate("patient", "firstName lastName")
      .populate("doctor", "name specialization")
      .populate("hospital", "hospitalName")
      .populate("medicalRecord");

    return res.status(200).json({
      success: true,
      count: prescriptions.length,
      data: prescriptions,
    });
  } catch (error) {
    console.error("Get All Prescriptions Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch prescriptions.",
      error: error.message,
    });
  }
};

/**
 * ============================================================
 * @Route   GET /api/v1/prescriptions/:id
 * @Desc    Get prescription by ID
 * @Access  Private
 * ============================================================
 */
export const getPrescriptionById = async (req, res) => {
  try {
    // Get prescription id from request params
    const { id } = req.params;

    // Find prescription by ID
    const prescription = await Prescription.findById(id)
      .populate("patient")
      .populate("doctor")
      .populate("hospital")
      .populate("medicalRecord");

    // Check if prescription exists
    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: "Prescription not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: prescription,
    });
  } catch (error) {
    console.error("Get Prescription By ID Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch prescription.",
      error: error.message,
    });
  }
};
/**
 * ============================================================
 * @Route   GET /api/v1/prescriptions/patient/:patientId
 * @Desc    Get all prescriptions of a specific patient
 * @Access  Private
 * ============================================================
 */
export const getPrescriptionsByPatient = async (req, res) => {
  try {
    // Get patient id from URL
    const { patientId } = req.params;

    // Find all prescriptions of the patient
    const prescriptions = await Prescription.find({ patient: patientId })
      .populate("doctor", "name specialization")
      .populate("hospital", "hospitalName")
      .populate("medicalRecord")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: prescriptions.length,
      data: prescriptions,
    });
  } catch (error) {
    console.error("Get Patient Prescriptions Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch patient prescriptions.",
      error: error.message,
    });
  }
};

/**
 * ============================================================
 * @Route   PUT /api/v1/prescriptions/:id
 * @Desc    Update prescription
 * @Access  Private (Doctor/Admin)
 * ============================================================
 */
export const updatePrescription = async (req, res) => {
  try {
    // Get prescription id
    const { id } = req.params;

    // Update prescription
    const updatedPrescription = await Prescription.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    // Check if prescription exists
    if (!updatedPrescription) {
      return res.status(404).json({
        success: false,
        message: "Prescription not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Prescription updated successfully.",
      data: updatedPrescription,
    });
  } catch (error) {
    console.error("Update Prescription Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update prescription.",
      error: error.message,
    });
  }
};

/**
 * ============================================================
 * @Route   DELETE /api/v1/prescriptions/:id
 * @Desc    Delete prescription
 * @Access  Private (Admin)
 * ============================================================
 */
export const deletePrescription = async (req, res) => {
  try {
    // Get prescription id
    const { id } = req.params;

    // Delete prescription
    const deletedPrescription = await Prescription.findByIdAndDelete(id);

    // Check if prescription exists
    if (!deletedPrescription) {
      return res.status(404).json({
        success: false,
        message: "Prescription not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Prescription deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Prescription Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete prescription.",
      error: error.message,
    });
  }
};