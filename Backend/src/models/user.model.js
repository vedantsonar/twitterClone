import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },

    fullname: {
        type: String,
        required: true,
    },

    avatar: {
        type: String,
        required: true,
    },

    coverImage: {
        type: String,
    },

    password: {
        type: String,
        required: [true, "Password is required"]
    }
}, {timestamps: true})

export const User = mongoose.model("User", userSchema)