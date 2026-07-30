import Notification from "../models/Notification.js";
import asyncHandler from "../utils/asyncHandler.js";


// Create Notification
export const createNotification = asyncHandler(async (req, res) => {

    const notification = await Notification.create(req.body);

    res.status(201).json({
        message: "Notification created",
        notification
    });
});


// Get All Notifications
export const getNotifications = asyncHandler(async (req, res) => {

    const notifications = await Notification.find();

    res.json(notifications);
});


// Delete Notification
export const deleteNotification = asyncHandler(async (req, res) => {

    await Notification.findByIdAndDelete(req.params.id);
         if(!Notification){
    return res.status(404).json({
        message:"Notification not found"
    });
}

    res.json({
        message: "Notification deleted"
    });
});