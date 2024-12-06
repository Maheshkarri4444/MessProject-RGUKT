import Feedback from "../models/feedback.model.js";

const createFeedback = async (req, res) => {
    try {
        const {
            food_rating,
            service_rating,
            hygiene_rating,
            overall_rating,
            feedback_message,
        } = req.body;
        const { feedback_type } = req.params; // Extract feedback_type from URL parameters
        const { messId } = req.params;
        const senderId = req.user._id; // Assume `protectRoute` middleware sets `req.user`
        if ( overall_rating < 0 || overall_rating > 5) {
            return res.status(400).json({ error: "Feedback rating must be between 0 and 5" });
        }

        // Validate feedback_type
        const validFeedbackTypes = [ "weekly", "monthly"];
        if (!validFeedbackTypes.includes(feedback_type)) {
            return res.status(400).json({ error: "Invalid feedback type" });
        }

        // Create a new feedback document
        const newFeedback = new Feedback({
            senderId,
            mess_number:messId,
            food_rating,
            service_rating,
            hygiene_rating,
            overall_rating,
            feedback_message,
            feedback_type, // Add feedback_type to the feedback document
        });

        // Save the feedback to the database
        await newFeedback.save();

        // Respond with success message
        res.status(201).json({
            message: "Feedback submitted successfully!",
            feedback: newFeedback,
        });
    } catch (error) {
        console.error("Error in createFeedback controller:", error.message);
        res.status(500).json({ error: "Internal Server Error at createFeedback controller" });
    }
};

export const getFeedback = async (req, res) => {
    try {
        const { feedback_type, messId } = req.params; // Extract feedback_type and messId from params

        // Validate feedback_type
        const validFeedbackTypes = ["weekly", "monthly"];
        if (!validFeedbackTypes.includes(feedback_type)) {
            return res.status(400).json({ error: "Invalid feedback type" });
        }

        // Validate messId
        const validMessIds = ["dh1", "dh2", "dh3", "dh4", "dh5", "dh6"];
        if (!validMessIds.includes(messId)) {
            return res.status(400).json({ error: "Invalid mess ID" });
        }

        // Get the current date and calculate the range based on feedback_type
        const now = new Date();
        let startDate, endDate;

        if (feedback_type === "weekly") {
            const dayOfWeek = now.getDay(); // Current day of the week (0 = Sunday)
            const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Difference to Monday
            startDate = new Date(now.setDate(now.getDate() + diffToMonday));
            startDate.setHours(0, 0, 0, 0); // Start of the current week (Monday)
            endDate = new Date(now.setDate(startDate.getDate() + 6));
            endDate.setHours(23, 59, 59, 999); // End of the current week (Sunday)
        } else if (feedback_type === "monthly") {
            startDate = new Date(now.getFullYear(), now.getMonth(), 1); // Start of the current month
            endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999); // End of the current month
        }

        // Fetch feedback based on type, messId, and date range
        const feedbacks = await Feedback.find({
            feedback_type,
            mess_number: messId,
            createdAt: { $gte: startDate, $lt: endDate }, // Match within the date range
        }).sort({ createdAt: -1 }); // Sort by newest feedback first

        // Check if feedback exists
        if (feedbacks.length === 0) {
            return res.status(404).json({ message: "No feedback found for the given criteria" });
        }

        // Respond with the feedback data
        res.status(200).json(feedbacks);
    } catch (error) {
        console.error("Error in getFeedback controller:", error.message);
        res.status(500).json({ error: "Internal Server Error at getFeedback controller" });
    }
};

export default createFeedback;
