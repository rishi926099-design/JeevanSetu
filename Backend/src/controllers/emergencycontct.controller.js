import EmergencyContact from "../models/EmergencyContact.js";
import asyncHandler from "../utils/asyncHandler.js";
//create emergencycontact
export const createEmergencyContact = asyncHandler(async(req,res)=>{
          if(!req.body.name || !req.body.phone){

    return res.status(400).json({
        message:"Name and phone are required"
    });

}
       const contact  = await EmergencyContact.create(req.body);
       //store new contact details
          res.status(201).json({
            message:"Emergency Contact created successfully",
            contact
          });
        });
          //get all emergencycontacts
export const getEmergencyContacts = asyncHandler(async(req,res)=>{
       const contacts  = await EmergencyContact.find();
          res.status(200).json(contacts);
});       
          //get single emergencycontact 
export const getEmergencyContactById = asyncHandler(async(req,res)=>{
       const  contact = await EmergencyContact.findById(req.params.id);
        
     
          res.status(200).json(contact);
});
          //update emergencycontact

export const updateEmergencyContact = asyncHandler(async(req,res)=>{
       const contact  = await EmergencyContact.findByIdAndUpdate(
        req.params.id,req.body,
        {new:true} // return update data
       );
          res.json({
            message: "Emergency Contact Updated successfully",
            contact
          });
        });
        //delete emergency contact
        export const deleteEmergencyContact = asyncHandler(async(req,res)=>{
       const contact  = await EmergencyContact.findByIdAndDelete(req.params.id);
              if(!contact){
    return res.status(404).json({
        message:"Contact not found"
    });
}
           res.json({
            message: "Emergency Contact deleted successfully",
          });
          
        });        

       
       
