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
        mobile: {
            type: String, // Use String if you plan to store numbers with country codes or spaces
            required: true,
            validate: {
                validator: function (v) {
                    return /^\d{10}$/.test(v); // Validate mobile numbers as 10 digits
                },
                message: (props) => `${props.value} is not a valid mobile number!`,
            },
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
