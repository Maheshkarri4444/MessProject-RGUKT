import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,  // Reference to the user who created the complaint
            required: true,
            ref: "User",  // Reference to the User model
        },
        mess_number: {
            type: String,
            required: true,
            enum: ["dh1", "dh2", "dh3", "dh4", "dh5", "dh6"], 
        },
        related: {
            type: String,
            required: true,
            enum: ["water", "food", "cleaning", "other"], 
        },
        other: {
            type: String,
            default: null,
            validate: {
                validator: function (value) {
                    return !(this.related === "other" && (!value || value.trim() === ""));
                },
                message: "'other' field must be filled if 'related' is 'other'",
            },
        },
        complaint_message: {
            type: String,
            required: true,
            minlength: 10, 
        },
        image: {
            type: String,  // Storing the file path of the uploaded image
            default: null, // Default to null if no image is provided
        }
    },
    { timestamps: true }
);

const Complaint = mongoose.model("Complaint", complaintSchema);

export default Complaint;
