import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({

    tweet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tweet"
    },

    comment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    },

    likedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }

})


export const Like = mongoose.model("Like", likeSchema)