import mongoose from "mongoose";

const messAuthoritySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            required: true,
            enum: ['mr', 'higher'],
        },
        authority_role: {
            type: String,
            validate: {
                validator: function (value) {
                    // If role is "higher", authority_role must not be empty
                    if (this.role === 'higher' && (!value || value.trim() === '')) {
                        return false;
                    }
                    return true;
                },
                message: "Authority role is required when role is 'higher'.",
            },
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
        email: {
            type: String,
            required: true,
            unique: true, // Ensure email uniqueness
            validate: {
                validator: function (v) {
                    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); // Basic email regex validation
                },
                message: (props) => `${props.value} is not a valid email!`,
            },
        },
        password: {
            type: String,
            minlength: 5,
            // Make password optional for Google logins
            default: null,
        },
    },
    { timestamps: true }
);

const MessAuthority = mongoose.model("MessAuthority", messAuthoritySchema);

export default MessAuthority;
