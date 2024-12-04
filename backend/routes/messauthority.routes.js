import express from "express";
import getFeedback from "../controllers/feedback.controller.js"
import protectRoute_authority from "../middleware/protectRouteAuthority.js";
import { getDailyComplaints,getWeeklyComplaints } from "../controllers/complaint.controller.js";
import { getAllIssues , updateSingleIssue ,deleteSingleIssue } from "../controllers/issue.controller.js";

const router = express.Router();

router.get("/feedback/:feedback_type/:messId",protectRoute_authority, getFeedback);//ignore this for a while until i clear the error
router.get("/complaints/daily/:messId",protectRoute_authority,getDailyComplaints);
router.get("/complaints/weekly/:messId",protectRoute_authority,getWeeklyComplaints);
router.get("/issues",protectRoute_authority,getAllIssues);
router.post("/issues/:issueId",protectRoute_authority,updateSingleIssue)
router.delete("/issues/:issueId",protectRoute_authority, deleteSingleIssue)



export default router;