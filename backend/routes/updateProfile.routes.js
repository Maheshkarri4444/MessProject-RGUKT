import express from "express";
import { updateStudentProfile } from "../controllers/profile.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();
//students
router.post("/",protectRoute, updateStudentProfile);




export default router;