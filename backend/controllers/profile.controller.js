import bcrypt from "bcrypt";
import Student from "../models/student.model.js";
import MessAuthority from "../models/messAuthority.model.js"; 
import mongoose from 'mongoose'; 

export const updateStudentProfile = async (req, res) => {
    try {
        const studentId = req.user._id; // Assuming the student ID is available in req.user from the auth middleware
        const { studentname, currentMess, mobile, password } = req.body;

        // Find the student by ID
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ error: "Student not found" });
        }

        // Update fields if provided
        if (studentname) student.studentname = studentname;
        if (currentMess) student.currentMess = currentMess;
        if (mobile) student.mobile = mobile;

        // Update password if provided
        if (password) {
            // Hash the new password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            student.password = hashedPassword;
        }

        // Save the updated student profile
        await student.save();

        res.status(200).json({
            message: "Student profile updated successfully",
            student: {
                studentname: student.studentname,
                currentMess: student.currentMess,
                mobile: student.mobile,
                role: student.role,
            },
        });
    } catch (error) {
        console.error("Error in updating student profile:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


export const updateMessAuthorityProfile = async (req, res) => {
    try {
        const { name, mobile, email, password } = req.body;
        
        // Get the logged-in mess authority's ID from the protected route
        const authorityId = req.user._id; // Assuming `req.user.id` is populated by the middleware

        // Validate authority ID
        if (!mongoose.Types.ObjectId.isValid(authorityId)) {
            return res.status(400).json({ error: "Invalid authority ID" });
        }

        // Find the mess authority by ID
        const authority = await MessAuthority.findById(authorityId);
        if (!authority) {
            return res.status(404).json({ error: "Authority not found" });
        }

        // Update fields if provided
        if (name) authority.name = name;
        if (mobile) authority.mobile = mobile;
        if (email) authority.email = email;
        if (password) {
            // Hash the new password before updating it
            const salt = await bcrypt.genSalt(10);
            authority.password = await bcrypt.hash(password, salt);
        }

        // Save the updated mess authority profile
        await authority.save();

        // Respond with the updated authority details (excluding password)
        res.status(200).json({
            message: "Mess authority profile updated successfully",
            authority: {
                name: authority.name,
                role: authority.role,
                mobile: authority.mobile,
                email: authority.email,
            },
        });
    } catch (error) {
        console.error("Error in updating mess authority profile:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};