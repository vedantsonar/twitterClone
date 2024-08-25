import { Like } from "../models/like.model.js";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";

const toggleTweetLike = async (req, res) => {
    try {
        const { tweetid } = req.params;

        const like = await Like.findOne({ tweet: tweetid, likedBy: req.user.id });

        if (like) {
            await like.deleteOne();
            return res.status(200).json({ "Success": "Like removed successfully of tweet" });
        }

        const likedTweet = await Like.create({
            tweet: tweetid,
            likedBy: req.user.id
        });

        res.status(200).json({ "Success": "Tweet liked successfully ", likedTweet });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("An error occurred while toggling the tweet's like.");
    }
};

const changeLikedState = async (req, res) => {
    try {
      const { tweetid } = req.params;
  
      const tweet = await Tweet.findById(tweetid);
  
      tweet.liked = !tweet.liked;
  
      await tweet.save();
  
      res.status(200).json({ tweet });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("An error occurred while changing liked state.");
    }
  };
  


const toggleCommentLike = async (req, res) => {
    try {
        const { commentid } = req.params;

        const like = await Like.findOne({ comment: commentid, likedBy: req.user.id });

        if (like) {
            await like.deleteOne();
            return res.status(200).json({ "Success": "Like removed successfully of comment" });
        }

        const likedComment = await Like.create({
            comment: commentid,
            likedBy: req.user.id
        });

        res.status(200).json({ "Success": "comment liked successfully", likedComment });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some error is occured in in toggle comment's like");
    }
    
}


const getAllLikeOfTweet = async (req, res) => {
    try {
        const { tweetid } = req.params

        const likes = await Like.find({ tweet: tweetid }).select("likedBy");

        // Extract user IDs from the likes
        const userIds = likes.map(like => like.likedBy);

        // Find user details
        const users = await User.find({ _id: { $in: userIds } }).select("username avatar");

        res.status(200).json({users});
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some error occurred in get all likes of tweet");
    }
}


const getAllLikeOfComment = async (req, res) => {
    try {

        const { commentid } = req.params;

        const likes = await Like.find({ comment: commentid }).select("likedBy");

        const userIds = likes.map(like => like.likedBy);

        const users = await User.find({ _id: { $in: userIds } }).select("username avatar");


        // const likes = await Like.find({comment: req.params.commentid})
        res.json({users})
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some error is occured in in get all like of comment");
    }
}

export {
    toggleCommentLike,
    toggleTweetLike,
    getAllLikeOfTweet,
    getAllLikeOfComment,
    changeLikedState
}