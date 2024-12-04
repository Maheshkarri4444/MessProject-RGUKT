import express from "express";
import { createIssue, updateIssue, deleteIssue,upvoteIssue,downvotIssue, getAllIssues, getSingleIssue } from "../controllers/issue.controller.js";
import protectRoute from "../middleware/protectRoute.js";
import upload from "../middleware/multer_issues.js";

const router = express.Router();

// Create a new issue
router.post("/create", protectRoute, upload.single("image"), createIssue);

// Update an existing issue
router.put("/update/:issueId", protectRoute, upload.single("image"), updateIssue);

// Delete an issue
router.delete("/delete/:issueId", protectRoute, deleteIssue);

// Get all issues
router.get("/", protectRoute, getAllIssues);

// Get a single issue by ID
router.get("/:issueId", protectRoute, getSingleIssue);

router.patch("/:issueId/upvote", protectRoute,upvoteIssue );

router.patch("/:issueId/downvote", protectRoute, downvotIssue);

export default router;
