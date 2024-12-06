import Notification from "../models/notification.model.js";

/**
 * Fetch all notifications in the latest order.
 * Notifications are sorted by `createdAt` in descending order.
 */
export const getAllNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find().sort({ createdAt: -1 }); // Sort by latest
        res.status(200).json({
            message: "Notifications fetched successfully",
            notifications,
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch notifications", error: error.message });
    }
};

export const sendNotification = async (req, res) => {
    try {
        const { messageTitle, messNumber, message_description } = req.body;

        // Validate request body
        if (!messageTitle || !messNumber || !message_description) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Create a new notification
        const notification = new Notification({
            messageTitle,
            messNumber,
            message_description,
        });

        await notification.save();

        res.status(201).json({
            message: "Notification sent successfully",
            notification,
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to send notification", error: error.message });
    }
};

/**
 * Update an existing notification by ID.
 */
export const updateNotification = async (req, res) => {
    try {
        const { notificationId } = req.params;
        const { messageTitle, messNumber, message_description } = req.body;

        // Find and update the notification
        const notification = await Notification.findByIdAndUpdate(
            notificationId,
            { messageTitle, messNumber, message_description },
            { new: true, runValidators: true } // Return updated document and validate fields
        );

        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }

        res.status(200).json({
            message: "Notification updated successfully",
            notification,
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to update notification", error: error.message });
    }
};

/**
 * Delete a notification by ID.
 */
export const deleteNotification = async (req, res) => {
    try {
        const { notificationId } = req.params;

        // Find and delete the notification
        const notification = await Notification.findByIdAndDelete(notificationId);

        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }

        res.status(200).json({ message: "Notification deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete notification", error: error.message });
    }
};