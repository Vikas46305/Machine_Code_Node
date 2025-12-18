import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    latitude: {
        type: Number,
        required: true,
        trim: true
    },
    longitude: {
        type: Number,
        required: true,
        trim: true
    },
    status: {
        type: String,
        default: "active",
        enum: ["active", "inactive"]
    },
    registration_day: {
        type: Number,
        required: true,
        min: 0,
        max: 6,
        index: true
    },
}, { timestamps: true })

export default mongoose.model("User", userSchema)