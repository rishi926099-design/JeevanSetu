import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Notification from "../models/Notification.js";

// CREATE
const createNotification = asyncHandler(async (req, res) => {
  const {
    recipient,
    type,
    title,
    message,
    resourceType,
    resourceId,
    priority,
    expiresAt,
  } = req.body;

  if (!recipient || !type || !title || !message) {
    throw new ApiError(
      400,
      "Recipient, type, title and message are required"
    );
  }

  const notification = await Notification.create({
    recipient,
    type,
    title,
    message,
    resourceType,
    resourceId,
    priority,
    expiresAt,
  });

  return res.status(201).json(
    new ApiResponse(
      201,
      notification,
      "Notification created successfully"
    )
  );
});

// GET MY NOTIFICATIONS
const getMyNotifications = asyncHandler(async (req, res) => {
  const filter = {
    recipient: req.user._id,
  };

  if (req.query.isRead !== undefined) {
    filter.isRead = req.query.isRead === "true";
  }

  const notifications = await Notification.find(filter)
    .sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse(
      200,
      notifications,
      "Notifications fetched successfully"
    )
  );
});

// GET BY ID
const getNotificationById = asyncHandler(async (req, res) => {
  const notification = await Notification.findOne({
    _id: req.params.id,
    recipient: req.user._id,
  });

  if (!notification) {
    throw new ApiError(
      404,
      "Notification not found"
    );
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      notification,
      "Notification fetched successfully"
    )
  );
});

// MARK AS READ
const markNotificationAsRead = asyncHandler(
  async (req, res) => {
    const notification =
      await Notification.findOneAndUpdate(
        {
          _id: req.params.id,
          recipient: req.user._id,
        },
        {
          $set: {
            isRead: true,
            readAt: new Date(),
          },
        },
        {
          new: true,
        }
      );

    if (!notification) {
      throw new ApiError(
        404,
        "Notification not found"
      );
    }

    return res.status(200).json(
      new ApiResponse(
        200,
        notification,
        "Notification marked as read"
      )
    );
  }
);

// MARK ALL AS READ
const markAllNotificationsAsRead = asyncHandler(
  async (req, res) => {
    await Notification.updateMany(
      {
        recipient: req.user._id,
        isRead: false,
      },
      {
        $set: {
          isRead: true,
          readAt: new Date(),
        },
      }
    );

    return res.status(200).json(
      new ApiResponse(
        200,
        null,
        "All notifications marked as read"
      )
    );
  }
);

// DELETE
const deleteNotification = asyncHandler(
  async (req, res) => {
    const notification =
      await Notification.findOneAndDelete({
        _id: req.params.id,
        recipient: req.user._id,
      });

    if (!notification) {
      throw new ApiError(
        404,
        "Notification not found"
      );
    }

    return res.status(200).json(
      new ApiResponse(
        200,
        null,
        "Notification deleted successfully"
      )
    );
  }
);

export {
  createNotification,
  getMyNotifications,
  getNotificationById,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
};