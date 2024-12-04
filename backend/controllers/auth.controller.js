import bcrypt from "bcryptjs";
import Student from "../models/student.model.js";
import MR from "../models/mr.model.js";
import MessAuthority from "../models/messAuthority.model.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";

/** STUDENT CONTROLLERS **/
export const studentSignup = async (req, res) => {
    try {
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
			 currentMess: newStudent.currentMess 
			});
    } catch (error) {
        console.error("Error in student signup:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const studentLogin = async (req, res) => {
    try {
        const { id, password } = req.body;
        const student = await Student.findOne({ id });

        if (!student || !(await bcrypt.compare(password, student.password))) {
            return res.status(400).json({ error: "Invalid ID or password" });
        }

        generateTokenAndSetCookie(student._id, res);
        res.status(200).json({ _id: student._id, studentname: student.studentname });
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

/** MR CONTROLLERS **/
export const mrSignup = async (req, res) => {
    try {
        const { studentname, id, mobile, password, confirmPassword, year, currentMess, class: className } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Passwords don't match" });
        }

        const mrExists = await MR.findOne({ id });
        if (mrExists) {
            return res.status(400).json({ error: "MR ID already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newMR = new MR({
            studentname,
            id,
            mobile,
            password: hashedPassword,
            year,
            currentMess,
            class: className,
        });

        await newMR.save();
        generateTokenAndSetCookie(newMR._id, res);

        res.status(201).json({
		_id: newMR._id, 
		studentname: newMR.studentname,
		
	 });
    } catch (error) {
        console.error("Error in MR signup:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const mrLogin = async (req, res) => {
    try {
        const { id, password } = req.body;
        const mr = await MR.findOne({ id });

        if (!mr || !(await bcrypt.compare(password, mr.password))) {
            return res.status(400).json({ error: "Invalid ID or password" });
        }

        generateTokenAndSetCookie(mr._id, res);
        res.status(200).json({ _id: mr._id, studentname: mr.studentname });
    } catch (error) {
        console.error("Error in MR login:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const mrLogout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Error in MR logout:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

/** MESS AUTHORITY CONTROLLERS **/
export const higherSignup = async (req, res) => {
    try {
        const { username, name, role, password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Passwords don't match" });
        }

        const authorityExists = await MessAuthority.findOne({ username });
        if (authorityExists) {
            return res.status(400).json({ error: "Username already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newAuthority = new MessAuthority({
            username,
            name,
            role,
            password: hashedPassword,
        });

        await newAuthority.save();
        generateTokenAndSetCookie(newAuthority._id, res);

        res.status(201).json({ _id: newAuthority._id, name: newAuthority.name });
    } catch (error) {
        console.error("Error in higher signup:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const higherLogin = async (req, res) => {
    try {
        const { username, password } = req.body;
        const authority = await MessAuthority.findOne({ username });

        if (!authority || !(await bcrypt.compare(password, authority.password))) {
            return res.status(400).json({ error: "Invalid username or password" });
        }

        generateTokenAndSetCookie(authority._id, res);
        res.status(200).json({ _id: authority._id, name: authority.name });
    } catch (error) {
        console.error("Error in higher login:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const higherLogout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Error in higher logout:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
