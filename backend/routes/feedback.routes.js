import express from "express";
import createFeedback from "../controllers/feedback.controller.js"
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/create/:messId/:feedback_type",protectRoute, createFeedback);




export default router;