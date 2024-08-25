import { Follower } from "../models/follower.model.js";
import { User } from "../models/user.model.js";

const toggleFollowing = async (req, res) => {
    try {
        const { pageid } = req.params;
        const followingCheck = await Follower.findOne({
            page: pageid,
            follower: req.user?.id 
        })

        if(followingCheck){
            await followingCheck.deleteOne()
            return res.status(200).json({"success": false,"message": "Removed from following list ", followingCheck})
        }

        const follow = await Follower.create({
            page: pageid,
            follower: req.user?.id 
        })

        res.status(200).json({"success": true,"message": "You followed page", follow})
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some error is occured in toggleFollowing");
    }
}

// controller to return follower list of a user
// TODO: followers/following list can see only who follows 

const getUserFollower = async (req, res) => {
    try {
        const { id } = req.params;
        const follower = await Follower.find(
            {page: id}
        ).select("follower")

        const followerIds = follower.map(ele => ele.follower)

        const users = await User.find({_id: { $in: followerIds}}).select("username avatar")

        res.status(200).json({users})
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some error is occured in getUserFollower");
    }
}

// controller to return following list of a user
// TODO: followers/following list can see only who follows 

const getUserFollowing = async (req, res) => {
    try {
        const following = await Follower.find(
            {follower: req.params.id}
        ).select("page")

        const followingIds = following.map(ele => ele.page)

        const users = await User.find({_id: { $in: followingIds}}).select("username avatar")

        res.status(200).json({users})
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some error is occured in getUserFollowing");
    }
}

export {
    toggleFollowing,
    getUserFollower,
    getUserFollowing
}