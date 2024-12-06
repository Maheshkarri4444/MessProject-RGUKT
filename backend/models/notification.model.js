import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
    {
        messageTitle: {
            type: String,
            required: true, // Ensure the title is mandatory
            trim: true, // Remove extra spaces
            minlength: 3, // Minimum length for title
        },
        messNumber: {
            type:String,
            required: true,
            enum: ["dh1", "dh2", "dh3", "dh4", "dh5", "dh6", "all"],
        },
        message_description: {
            type: String,
            required: true, // Ensure description is mandatory
            trim: true, // Remove extra spaces
            minlength: 5, // Minimum length for description
        },
    },
    { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;