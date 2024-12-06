import express from "express";
import { getAllNotifications } from "../controllers/notifications.controller.js";

const router = express.Router();

// Route to fetch all notifications
router.get("/", getAllNotifications);

export default router;
