import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,  // Reference to the user who created the complaint
            required: true,
            ref: "Student",  // Reference to the User model
        },
        mess_number: {
            type: String,
            required: true,
            enum: ["dh1", "dh2", "dh3", "dh4", "dh5", "dh6"], 
        },
        food_rating: {
            type: Number, // Use Number for ratings
            required: true,
            min: 0, // Minimum allowed rating
            max: 5,
            default:0 // Maximum allowed rating
        },
        service_rating: {
            type: Number, // Use Number for ratings
            required: true,
            min: 0, // Minimum allowed rating
            max: 5,
            default:0 // Maximum allowed rating
        },
        hygiene_rating: {
            type: Number, // Use Number for ratings
            required: true,
            min: 0, // Minimum allowed rating
            max: 5,
            default:0 // Maximum allowed rating
        },
        overall_rating: {
            type: Number, // Use Number for ratings
            required: true,
            min: 0, // Minimum allowed rating
            max: 5,
            default:0 // Maximum allowed rating
        },
        feedback_message: {
            type: String,
            required: true,
            minlength: 10, 
        },
        feedback_type: {
            type: String,
            required: true,
            enum: [ "weekly", "monthly"], // Valid options for feedback type
        },
    },
    { timestamps: true }
);

const Feedback = mongoose.model("Feedback", feedbackSchema);

export default Feedback;
