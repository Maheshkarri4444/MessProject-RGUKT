import Complaint from "../models/complaint.model.js"; 
import fs from "fs"; // For deleting old images (if you're using local storage)

export const complaint = async (req, res) => {
    try {
        const { related, other, complaint_message } = req.body;
        const { messid: mess_number } = req.params;
        const senderId = req.user._id;

        if (related === "other" && (!other || other.trim() === "")) {
            return res.status(400).json({
                error: "'other' field must be filled if 'related' is 'other'",
            });
        }

        let imagePath = null;
        if (req.file) {
            imagePath = req.file.path;  // Store the relative path to the image
        }

        const newComplaint = new Complaint({
            senderId,
            mess_number,
            related,
            other,
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
        const { related, other, complaint_message } = req.body;
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
        complaint.related = related || complaint.related;  // Keep the existing value if not provided
        complaint.other = other || complaint.other;        // Keep the existing value if not provided
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
        const { complaintId } = req.params;  // Complaint ID from the URL
        const senderId = req.user._id;      // Authenticated user ID

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