import express from "express";
import connectToMongoDB from "./db/connectToMongoDB.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import complaintRoutes from "./routes/complaint.routes.js";
import feedbackRoutes from "./routes/feedback.routes.js";
import messauthorityRoutes from "./routes/messauthority.routes.js"
import issueRoutes from "./routes/issue.routes.js"
import notificationRoutes from "./routes/notification.routes.js"
import updateProfileRoutes from "./routes/updateProfile.routes.js"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cookieParser());

//Student Routes
app.use("/api/auth", authRoutes);//also includes for Messauthorities
app.use("/api/complaint",complaintRoutes);
app.use("/api/feedback",feedbackRoutes);
app.use("/api/issues",issueRoutes);
app.use("/api/notifications",notificationRoutes);
app.use("/api/updateprofile",updateProfileRoutes)

//Mess Authority routes
app.use("/api/messauthority",messauthorityRoutes);


// Start the server
app.listen(PORT, () => {
    connectToMongoDB();
    console.log(`Server is running on ${PORT}`);
});
