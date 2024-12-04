import mongoose from "mongoose";

const messAuthoritySchema = new mongoose.Schema(
    {
        username:{
            type:String,
            required:true,
            unique:true
        },
        name: {
            type: String,
            required: true,
        },
        role:{
            type: String,
            required:true,
        },
        password: {
            type: String,
            minlength: 5,
            // Make password optional for Google logins
            default: null,
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

const MessAuthority = mongoose.model("MessAuthoritys", messAuthoritySchema);

export default MessAuthority;
