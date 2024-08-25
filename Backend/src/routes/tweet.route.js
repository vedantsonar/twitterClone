import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js"
import  { fetchUser }  from "../middlewares/fetchUser.middleware.js";
import { createTweet, updateTweet, deleteTweet, getUserTweets, getFeedTweets } from "../controllers/tweet.controller.js"

const router= Router()

router.use(fetchUser);  // Apply fetchUser middleware to all routes in this file

router.route("/").post(
    
    upload.fields([
        {
            name: "image",
            maxCount: 1
        }
    ]),
    createTweet
)

router.route("/updateTweet/:tweetid").patch(
    upload.fields([
        {
            name: "image",
            maxCount: 1
        }
    ]),
    updateTweet
)
router.route("/deleteTweet/:tweetid").delete(deleteTweet)

router.route("/userTweet").get(getUserTweets);

// get subscribed tweets
router.route("/usersFeed").get(getFeedTweets); //following tweet

export default router