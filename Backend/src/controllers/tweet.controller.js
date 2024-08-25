import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js"
import { Follower } from "../models/follower.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { asyncHandler } from "../utils/asynchandler.utils.js";
import mongoose from "mongoose";

const createTweet = asyncHandler( async (req, res) => {
    let success = false;

    const user = req.user?.id;
    if(!user){
        res.status(400).json({success, error: "Please login"})
    }

    const { content } = req.body;
    if(!content){
        res.status(404).json({success, error: "Content is required"})
    }

    const imageLocalPath = req.files?.image?.[0]?.path || null;

    const image = await uploadOnCloudinary(imageLocalPath)

    const tweet = await Tweet.create({
        owner: user,
        content,
        image: image?.url || "",
        liked: false
    })

    success = true
    res.status(200).json({success, tweet})
})

const updateTweet = async (req, res) => {
    let success = false
    try {
        const  { content }  = req.body;

        // Check if content is provided
        if (!content) {
            return res.status(400).json({success,  message: "Content is required" });
        }

        // Find the tweet by ID
        let tweet = await Tweet.findById(req.params.tweetid);

        // Check if the user owns the tweet
        if (tweet.owner.toString() !== req.user.id) {
            return res.status(401).send({success, message: "Not allowed, it belongs to another user"});
        }

        // Handle the image update if provided
        const imageLocalPath = req.files?.image?.[0]?.path || null;
        let imageUrl = tweet.image; // Default to existing image if none provided
        if (imageLocalPath) {
            const image = await uploadOnCloudinary(imageLocalPath);
            if (image) {
                imageUrl = image.url;
            }
        }

        // Update the tweet
        tweet = await Tweet.findByIdAndUpdate(
            req.params.tweetid,
            { $set: { content, image: imageUrl } },
            { new: true }
        );

        // Send the updated tweet as the response
        success = true
        res.status(200).json({success, message: "Updated Successfully", tweet });

    } catch (error) {
        console.error(error.message);
        res.status(500).send({success, message: "An error occurred in update tweet"});
    }
};

const deleteTweet = asyncHandler( async (req, res) => {
    let success = false;
    try {
        //Find the Note to be delete and delete it
        let tweet = await Tweet.findById(req.params.tweetid)
        if(!tweet) {
            res.status(404).send({success, message: "Tweet not found"})
        }

        //Allow deletion only if oser owns this note
        if (tweet.owner.toString() !== req.user.id) {
            return res.status(401).send("Not allowed, it belongs to another user");
        }

        tweet = await Tweet.findByIdAndDelete(req.params.tweetid)
        success=true;
        res.status(200).json({success, message: "Delete Successfully"})
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send({success, message: "Some error is occured in delete tweet"});
    }
})

// shown only created by user to user
const getUserTweets = asyncHandler( async (req, res) => {
    try {
        
        const userId  = req.user.id
        if(!userId){
            return res.status(400).json({"error": "Please login"})
        }

        const tweets = await Tweet.find({owner: userId})
        
        const user = await User.findById(userId).select("username avatar")

        res.status(200).json(tweets)
    } 
    catch (error) {
        console.error(error.message);
        res.status(500).send("Some error is occured in in get user tweet");
    }
})


const getFeedTweets = asyncHandler( async (req, res) => {
    try {
        const userId = req.user.id;
        if (!userId) {
            return res.status(400).json({ "error": "Please login" });
        }

        const following = await Follower.find({ follower: userId }).select('page');
        if (!following || following.length === 0) {
            return res.status(404).json({ "message": "No pages followed" });
        }

        // Extract page IDs
        const pageIds = following.map(element => new mongoose.Types.ObjectId(element.page));

        // Find tweets written by these pages
        const tweets = await Tweet.aggregate([
            {
                $match: {
                    owner: { $in: pageIds }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "owner",
                    foreignField: "_id",
                    as: "Owner"
                }
            },
            {
                $unwind: "$Owner"
            },
            {
                $project: {
                    image: 1,
                    content: 1,
                    liked: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    "Owner.username": 1,
                    "Owner.avatar": 1,
                    "Owner.fullname": 1,
                    // "Owner.coverImage": 1
                }
            }
        ])
    

        res.status(200).json(tweets);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some error occurred in getting feed tweets");
    }
})


export { createTweet, updateTweet, deleteTweet, getUserTweets, getFeedTweets }