import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
    {
        studentname: {
            type: String,
            required: true,
        },
        role:{
            type:String,
            default:"student"
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
        currentMess:{
            type:String,
            enum:['dh1','dh2','dh3','dh4','dh5','dh6']
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

const Student = mongoose.model("Students", studentSchema);

export default Student;
