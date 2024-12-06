import Complaint from "../models/complaint.model.js";
import Feedback from "../models/feedback.model.js";

export const getIssuesForStudent = async (req, res) => {
    try {
        const studentId = req.user.id; // Assuming the `protectRoute` middleware attaches the user info to `req.user`

        // Fetch all complaints made by the student
        const complaints = await Complaint.find({ studentId }).sort({ createdAt: -1 });

        // Fetch all feedbacks made by the student
        const feedbacks = await Feedback.find({ studentId }).sort({ createdAt: -1 });

        res.status(200).json({
            message: "Issues retrieved successfully.",
            complaints,
            feedbacks,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
