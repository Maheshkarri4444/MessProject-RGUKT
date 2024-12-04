import mongoose from "mongoose";

const issueSchema = new mongoose.Schema(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,  // Reference to the user who created the issue
            required: true,
            ref: "Student",  // Reference to the Student model
        },
        issue_title: {
            type: String,
            required: true,
            minlength: 5,
        },
        issue_message: {
            type: String,
            required: true,
            minlength: 10, 
        },
        image: {
            type: String, // Storing the file path or URL of the image
            default: null, // Default to null if no image is provided
        },
        resolved: {
            type: Boolean, // True if the issue is resolved, false otherwise
            default: false, // Default to unresolved
        },
        upvotes: {
            type: Number,
            default: 0, // Default to 0
        },
        downvotes: {
            type: Number,
            default: 0, // Default to 0
        },
    },
    { timestamps: true }
);

const Issue = mongoose.model("Issue", issueSchema);

export default Issue;
