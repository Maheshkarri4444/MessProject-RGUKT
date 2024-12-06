import jwt from "jsonwebtoken";
import MessAuthority from "../models/messAuthority.model.js"; // Assuming you have a model for MessAuthority

const protectRoute = async (req, res, next) => {
    try {
        // Check for JWT in cookies
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ error: "Unauthorized - No Token Provided" });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ error: "Unauthorized - Invalid Token" });
        }

        // Check in the Mr collection
        let user = await MessAuthority.findById(decoded.userId).select("-password");

        // If user is not found in any collection, return an error
        if (!user) {
            return res.status(400).json({ error: "You do not belong to MessAuthority" });
        }

        // Attach user to the request object
        req.user = user;

        // Proceed to the next middleware
        next();
    } catch (error) {
        console.error("Error in protectRoute middleware: ", error.message);
        res.status(500).json({ error: "Internal Server Error at protectRoute" });
    }
};

export default protectRoute;
