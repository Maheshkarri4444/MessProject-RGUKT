import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { getIssuesForStudent } from "../controllers/issue.controller.js";

const router = express.Router();

router.get("/getissues",protectRoute,getIssuesForStudent);

export default router;
