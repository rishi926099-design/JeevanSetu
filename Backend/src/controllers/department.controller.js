import Department from "../models/Department.js";
import asyncHandler from "../utils/asyncHandler.js";
//create departmet
export const createDepartment = asyncHandler(async(req,res)=>{
       const department  = await Department.create(req.body);
          res.status(201).json({
            message:"Department Created",
            department
          });
        });
          //get all departmet
export const getDepartments = asyncHandler(async(req,res)=>{
         const page = req.query.page || 1;
          const limit = 10;

       const departments  = await Department.find()
              .skip((page-1)*limit)
               .limit(limit);
          res.status(200).json(departments);
});       
          //get single department 
export const getDepartmentById = asyncHandler(async(req,res)=>{
       const department  = await Department.findById(req.params.id);
        // prevent to send empty response if id not exist
       if(!department){
        return res.status(404).json({
            message:"Department not found"
        });
      }
          res.status(200).json(department);
});
          //update department

export const updateDepartment = asyncHandler(async(req,res)=>{
       const department  = await Department.findByIdAndUpdate(
        req.params.id,req.body,
        {new:true}
       );
       if(!department){
    return res.status(404).json({
        message:"Department not found"
    });
}
          res.json({
            message: "Department Updated successfully",
            department
          });
        });
        //delete department
        export const deleteDepartment = asyncHandler(async(req,res)=>{
       const department  = await Department.findByIdAndDelete(req.params.id);
            if(!department){
    return res.status(404).json({
        message:"Department not found"
    });
}
          res.json({
            message: "Department deleted successfully",
          });
          
        });        

       
       
