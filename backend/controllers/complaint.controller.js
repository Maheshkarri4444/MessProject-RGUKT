import Complaint from "../models/complaint.model.js";
import fs from "fs"; // For deleting old images (if you're using local storage)

export const complaint = async (req, res) => {
    try {
        const { related, other, complaint_message, complaint_title } = req.body;
        const { messid: mess_number } = req.params;
        const senderId = req.user._id;

        if (!complaint_title || complaint_title.trim().length < 5) {
            return res.status(400).json({
                error: "'complaint_title' is required and must be at least 5 characters long.",
            });
        }

        if (related === "other" && (!other || other.trim() === "")) {
            return res.status(400).json({
                error: "'other' field must be filled if 'related' is 'other'",
            });
        }

        let imagePath = null;
        if (req.file) {
            imagePath = req.file.path; // Store the relative path to the image
        }

        const newComplaint = new Complaint({
            senderId,
            mess_number,
            related,
            other,
            complaint_title, // Added complaint_title
            complaint_message,
            image: imagePath,
        });

        await newComplaint.save();

        res.status(201).json({
            message: "Complaint created successfully!",
            complaint: newComplaint,
        });
    } catch (error) {
        console.log("Error in Complaint controller:", error.message);
        res.status(500).json({ error: "Internal Server Error at Complaint Controller" });
    }
};

export const updateComplaint = async (req, res) => {
    try {
        const { complaintId } = req.params; // Complaint ID from the URL
        const { related, other, complaint_message, complaint_title } = req.body;
        const senderId = req.user._id; // Assuming `req.user._id` contains the authenticated user's ID

        // Find the complaint by its ID
        const complaint = await Complaint.findById(complaintId);

        // If complaint not found
        if (!complaint) {
            return res.status(404).json({ error: "Complaint not found" });
        }

        // Check if the logged-in user is the sender of this complaint
        if (complaint.senderId.toString() !== senderId.toString()) {
            return res.status(403).json({ error: "You are not authorized to update this complaint" });
        }

        // If related is 'other', ensure the 'other' field is filled
        if (related === "other" && (!other || other.trim() === "")) {
            return res.status(400).json({
                error: "'other' field must be filled if 'related' is 'other'",
            });
        }

        // Update the complaint with new data
        complaint.related = related || complaint.related; // Keep the existing value if not provided
        complaint.other = other || complaint.other; // Keep the existing value if not provided
        complaint.complaint_title = complaint_title || complaint.complaint_title; // Updated complaint_title
        complaint.complaint_message = complaint_message || complaint.complaint_message;

        // If a new image is uploaded, handle it
        if (req.file) {
            // Delete the old image from the file system if using local storage
            if (complaint.image) {
                const oldImagePath = `uploads/${complaint.image}`;
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath); // Delete the old image
                }
            }

            // Set the new image path (assuming image is uploaded to 'uploads' folder)
            complaint.image = req.file.filename; // Store the filename or image URL in the database
        }

        // Save the updated complaint
        await complaint.save();

        // Respond with the updated complaint
        res.status(200).json({
            message: "Complaint updated successfully!",
            complaint,
        });
    } catch (error) {
        console.log("Error in update Complaint controller:", error.message);
        res.status(500).json({ error: "Internal Server Error at update Complaint Controller" });
    }
};

export const deleteComplaint = async (req, res) => {
    try {
        const { complaintId } = req.params; // Complaint ID from the URL
        const senderId = req.user._id; // Authenticated user ID

        // Find the complaint by its ID
        const complaint = await Complaint.findById(complaintId);

        // If complaint not found
        if (!complaint) {
            return res.status(404).json({ error: "Complaint not found" });
        }

        // Check if the logged-in user is the sender of this complaint
        if (complaint.senderId.toString() !== senderId.toString()) {
            return res.status(403).json({ error: "You are not authorized to delete this complaint" });
        }

        await Complaint.deleteOne({ _id: complaintId });

        // Respond with success message
        res.status(200).json({
            message: "Complaint deleted successfully!",
        });
    } catch (error) {
        console.log("Error in delete Complaint controller:", error.message);
        res.status(500).json({ error: "Internal Server Error at Delete Complaint Controller" });
    }
};

export const getDailyComplaints = async (req, res) => {
    try {
        const { messId } = req.params;

        // Validate messId
        const validMessIds = ["dh1", "dh2", "dh3", "dh4", "dh5", "dh6"];
        if (!validMessIds.includes(messId)) {
            return res.status(400).json({ error: "Invalid mess ID" });
        }

        // Calculate date range for the current day
        const now = new Date();
        const startDate = new Date(now.setHours(0, 0, 0, 0)); // Start of the day
        const endDate = new Date(now.setHours(23, 59, 59, 999)); // End of the day

        // Fetch complaints for the current day and messId
        const complaints = await Complaint.find({
            mess_number: messId,
            createdAt: { $gte: startDate, $lt: endDate },
        }).sort({ createdAt: -1 }); // Sort by newest first

        // Check if complaints exist
        if (complaints.length === 0) {
            return res.status(404).json({ message: "No complaints found for the current day" });
        }

        res.status(200).json(complaints);
    } catch (error) {
        console.error("Error in getDailyComplaints controller:", error.message);
        res.status(500).json({ error: "Internal Server Error at getDailyComplaints controller" });
    }
};

export const getWeeklyComplaints = async (req, res) => {
    try {
        const { messId } = req.params;

        // Validate messId
        const validMessIds = ["dh1", "dh2", "dh3", "dh4", "dh5", "dh6"];
        if (!validMessIds.includes(messId)) {
            return res.status(400).json({ error: "Invalid mess ID" });
        }

        // Calculate date range for the current week
        const now = new Date();
        const dayOfWeek = now.getDay(); // Current day of the week (0 = Sunday)
        const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Difference to Monday
        const startDate = new Date(now.setDate(now.getDate() + diffToMonday));
        startDate.setHours(0, 0, 0, 0); // Start of the week (Monday)
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 6);
        endDate.setHours(23, 59, 59, 999); // End of the week (Sunday)

        // Fetch complaints for the current week and messId
        const complaints = await Complaint.find({
            mess_number: messId,
            createdAt: { $gte: startDate, $lt: endDate },
        }).sort({ createdAt: -1 }); // Sort by newest first

        // Check if complaints exist
        if (complaints.length === 0) {
            return res.status(404).json({ message: "No complaints found for the current week" });
        }

        res.status(200).json(complaints);
    } catch (error) {
        console.error("Error in getWeeklyComplaints controller:", error.message);
        res.status(500).json({ error: "Internal Server Error at getWeeklyComplaints controller" });
    }
};
