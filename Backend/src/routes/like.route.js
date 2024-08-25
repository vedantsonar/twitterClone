import { Router } from "express";
import {
    toggleCommentLike,
    toggleTweetLike,
    getAllLikeOfTweet,
    getAllLikeOfComment,
    changeLikedState
} from "../controllers/like.controller.js"
import { fetchUser } from "../middlewares/fetchUser.middleware.js";

const router = Router();

router.use(fetchUser);

router.route("/comment-like/:commentid").post(toggleCommentLike)
router.route("/tweet-like/:tweetid").post(toggleTweetLike)

router.route("/get-all-like-of-tweet/:tweetid").get(getAllLikeOfTweet)
router.route("/get-all-like-of-comment/:commentid").get(getAllLikeOfComment)

router.route("/change-liked-state/:tweetid").patch(changeLikedState)

export default router