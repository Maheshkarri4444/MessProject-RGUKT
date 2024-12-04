import express from "express";
import { complaint, updateComplaint , deleteComplaint} from "../controllers/complaint.controller.js";
import protectRoute from "../middleware/protectRoute.js";
import upload from "../middleware/multer.js"; 

const router = express.Router();

router.post("/create/:messid",protectRoute, upload.single('image'),complaint);
router.put("/update/:complaintId",protectRoute, upload.single("image"),updateComplaint);
router.delete("/delete/:complaintId",protectRoute,deleteComplaint);


export default router;