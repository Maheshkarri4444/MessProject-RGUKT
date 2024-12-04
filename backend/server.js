import express from "express";
import connectToMongoDB from "./db/connectToMongoDB.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import complaintRoutes from "./routes/complaint.routes.js";
import feedbackRoutes from "./routes/feedback.routes.js";
import issueRoutes from "./routes/issue.routes.js"
import messauthorityRoutes from "./routes/messauthority.routes.js"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cookieParser());


app.use("/api/auth", authRoutes);
app.use("/api/complaint",complaintRoutes);
app.use("/api/feedback",feedbackRoutes);
app.use("/api/issue",issueRoutes);

app.use("/api/messauthority",messauthorityRoutes);


// Start the server
app.listen(PORT, () => {
    connectToMongoDB();
    console.log(`Server is running on ${PORT}`);
});
