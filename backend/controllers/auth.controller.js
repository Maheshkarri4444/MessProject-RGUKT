import bcrypt from "bcryptjs";
import Student from "../models/student.model.js";
import MessAuthority from "../models/messAuthority.model.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";

/** STUDENT CONTROLLERS **/
export const studentSignup = async (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        const { studentname, id, mobile, password, confirmPassword, currentMess } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Passwords don't match" });
        }

        const studentExists = await Student.findOne({ id });
        if (studentExists) {
            return res.status(400).json({ error: "Student ID already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newStudent = new Student({
            studentname,
            id,
            mobile,
            password: hashedPassword,
            currentMess,
        });

        await newStudent.save();
        generateTokenAndSetCookie(newStudent._id, res);

        res.status(201).json({
			 _id: newStudent._id, 
			 studentname: newStudent.studentname,
			 currentMess: newStudent.currentMess,
             role: "student"
			});
    } catch (error) {
        console.error("Error in student signup:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const studentLogin = async (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        const { id, password } = req.body;
        const student = await Student.findOne({ id });

        if (!student || !(await bcrypt.compare(password, student.password))) {
            return res.status(400).json({ error: "Invalid ID or password" });
        }

        generateTokenAndSetCookie(student._id, res);
        res.status(200).json({ _id: student._id, studentname: student.studentname , role: "student"});
    } catch (error) {
        console.error("Error in student login:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const studentLogout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Error in student logout:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


export const messAuthoritySignup = async (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        const { name, role, authority_role, mobile, email, password } = req.body;

        // Check if the email already exists
        const existingUser = await MessAuthority.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists." });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new MessAuthority
        const messAuthority = new MessAuthority({
            name,
            role,
            authority_role: role === "higher" ? authority_role : null,
            mobile,
            email,
            password: hashedPassword,
        });

        await messAuthority.save();
        generateTokenAndSetCookie(messAuthority._id, res);
        res.status(201).json({ message: "Mess Authority registered successfully.",
            _id: messAuthority._id, name: messAuthority.name , role: messAuthority.role
         });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Login function
export const messAuthorityLogin = async (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        const { email, password } = req.body;

        // Check if the user exists
        const messAuthority = await MessAuthority.findOne({ email });
        if (!messAuthority) {
            return res.status(404).json({ message: "User not found." });
        }

        // Validate the password
        const isPasswordValid = await bcrypt.compare(password, messAuthority.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials." });
        }

        generateTokenAndSetCookie(messAuthority._id, res);
        res.status(200).json({ message: "Logged in successfully.", 
            _id: messAuthority._id, name: messAuthority.name , role: messAuthority.role
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Logout function
export const messAuthorityLogout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
