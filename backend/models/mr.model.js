import mongoose from "mongoose";

const mrSchema = new mongoose.Schema(
    {
        studentname: {
            type: String,
            required: true,
        },
        id: {
            type: String,
            required: true,
            unique: true,
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
        year:{
            type:String,
            enum:['p1','p2','e1','e2','e3','e4']
        },
        currentMess:{
            type:String,
            enum:['dh1','dh2','dh3','dh4','dh5','dh6']
        },
        class:{
            type:String,
        },
        password: {
            type: String,
            minlength: 5,
            default: null, // Password is optional for Google logins
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

const MR = mongoose.model("Mrs", mrSchema);

export default MR;
