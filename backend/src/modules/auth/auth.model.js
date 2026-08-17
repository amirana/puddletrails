import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            trim: true,
            minlength: 2,
            maxlength: 50,
            required: [true, "First name is required"],
        },
        lastName: {
            type: String,
            trim: true,
            minlength: 2,
            maxlength: 50,
            required: [true, "Last name is required"],
        },
        email: {
            type: String,
            trim: true,
            unique: true,
            lowercase: true,
            required: [true, "Email is required"],
        },
        password: {
            type: String,
            minlength: 8,
            select: false,
            required: [true, "Password is required"],
        },
        avatar: {
            type: String,
        },
        city: {
            type: String,
        },
        country: {
            type: String,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        verificationToken: {
            type: String,
            select: false, // do not want to return the field while creating an object
        },
        refreshToken: {
            type: String,
            select: false,
        },
        resetPasswordToken: {
            type: String,
            select: false,
        },
        resetPasswordExpires: {
            type: Date,
            select: false,
        },
    },
    { timestamps: true },
);

export default mongoose.model("User", userSchema);
