import express from "express";
import {getFeedback} from "../controllers/feedback.controller.js"
import protectRoute_authority from "../middleware/protectRouteAuthority.js";
import { getComplaints , updateComplaintStatus } from "../controllers/complaint.controller.js";
import { sendNotification , updateNotification , deleteNotification, getAllNotifications } from "../controllers/notifications.controller.js";
import { updateMessAuthorityProfile } from "../controllers/profile.controller.js";

const router = express.Router();

//feedbacks
router.get("/feedback/:feedback_type/:messId",protectRoute_authority, getFeedback);

//complaints
router.post("/complaints/:messId", protectRoute_authority, getComplaints);
router.put("/complaints/:complaintId/status", protectRoute_authority, updateComplaintStatus);

//notifications
router.post("/notification",protectRoute_authority,sendNotification);
router.put("/notification/:notificationId",protectRoute_authority,updateNotification);
router.delete("/notification/:notificationId",protectRoute_authority,deleteNotification);
router.get("/getallnotifications",protectRoute_authority,getAllNotifications);

//updating Profile
router.post("/updateprofile", protectRoute_authority, updateMessAuthorityProfile);






export default router;