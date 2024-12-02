import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            minlength: 6,
            // Make password optional for Google logins
            default: null,
        },
        gender: {
            type: String,
            enum: ["male", "female", "other"],
            default: "other",
        },
        googleId: {
            type: String, // Store the Google user ID
            unique: true,
            sparse: true, // Allows unique but nullable values
        },
        authProvider: {
            type: String,
            enum: ["local", "google"],
            default: "local",
        },
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
