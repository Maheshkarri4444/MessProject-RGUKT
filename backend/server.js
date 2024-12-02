import express from "express";
import connectToMongoDB from "./db/connectToMongoDB.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import complaintRoutes from "./routes/complaint.routes.js";



dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cookieParser());


app.use("/api/auth", authRoutes);
app.use("/api/complaint",complaintRoutes)


// Start the server
app.listen(PORT, () => {
    connectToMongoDB();
    console.log(`Server is running on ${PORT}`);
});
