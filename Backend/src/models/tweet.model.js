import mongoose from "mongoose";

const tweetSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    image: {
        type: String
    },

    content: {
        type: String,
        required: true
    },

    liked: {
        type: Boolean,
        required: true
    }
    
}, {timestamps: true})

export const Tweet = mongoose.model("Tweet", tweetSchema)