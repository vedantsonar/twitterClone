import mongoose from "mongoose";

const followerSchema = new mongoose.Schema({
    page: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    
    follower: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }

}, {timestamps: true})

export const Follower = mongoose.model("follower", followerSchema)