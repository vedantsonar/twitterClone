import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { asyncHandler } from "../utils/asynchandler.utils.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const registerUser = async (req, res) => {
    let success = false;

    try {
        const { username, email, fullname, password } = req.body;

        if ([username, email, fullname, password].some((field) => !field?.trim())) {
            return res.status(400).json({ success, message: "All fields are required" });
        }

        const existedUser = await User.findOne({ $or: [{ username }, { email }] });

        if (existedUser) {
            return res.status(400).json({ success, message: "User with this email/username already exists" });
        }

        const avatarLocalPath = req.files?.avatar?.[0]?.path;
        const coverImageLocalPath = req.files?.coverImage?.[0]?.path || null;

        if (!avatarLocalPath) {
            return res.status(400).json({ success, message: "Avatar file is required" });
        }

        const avatar = await uploadOnCloudinary(avatarLocalPath);
        const coverImage = coverImageLocalPath ? await uploadOnCloudinary(coverImageLocalPath) : null;

        if (!avatar) {
            return res.status(400).json({ success, message: "Failed to upload avatar file" });
        }

        const salt = await bcrypt.genSalt(10);
        const encryptedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            username,
            email,
            fullname,
            avatar: avatar.url,
            coverImage: coverImage?.url || "",
            password: encryptedPassword
        });

        const data = { user: { id: user._id } };
        const authtoken = jwt.sign(data, process.env.JWT_SECRET);

        success = true;
        return res.json({ success, authtoken });

    } catch (error) {
        console.error(error.message);
        if (!res.headersSent) {
            return res.status(500).json({ message: "An error occurred while registering the user" });
        }
    }
};

const loginUser = async (req, res) => {
    let success = false;
    try {
        const { email, username, password } = req.body;
    
        if (!(email || username) || !password) {
            return res.status(400).json({ success, error: "Please enter email or username and password" });
        }
    
        const user = await User.findOne({ $or: [{ username }, { email }] });
    
        if (!user) {
            return res.status(404).json({ success, error: "User does not exist. Please register." });
        }
    
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            return res.status(400).json({ success, error: "Incorrect password. Please try again." });
        }
    
        // Generate token
        const data = {
            user: {
                id: user._id
            }
        };
    
        const authtoken = jwt.sign(data, process.env.JWT_SECRET);
        success = true;
        return res.status(200).json({ success, authtoken });
    
    } catch (error) {
        console.error(error.message);
        if (!res.headersSent) { // Check if headers have been sent
            return res.status(500).json({ error: "An error occurred while logging in Login" });
        }
    }
};


const getCurrentUser = asyncHandler( async (req, res) => {
   

    const userId = req.user.id;

    const user = await User.findById(userId)
    
    const username = user.username

    if(!username?.trim){
        return res.status(400).json({"error": "username is missing"})
    }

    const profile = await User.aggregate([
        {
            $match: {
                username: username
            }
        },
        {
            $lookup: {
                from: "followers",
                localField: "_id",
                foreignField: "page",
                as: "Followers"
            }
        },
        {
            $lookup: {
                from: "followers",
                localField: "_id",
                foreignField: "follower",
                as: "Following"
            }
        },
        {
            $addFields: {
                followerCount: {
                    $size: "$Followers"
                },
                followingCount: {
                    $size: "$Following"
                },
                isFollowed: {
                    $cond: {
                        if: {$in: [req.user?.id, "$Followers.follower"]},
                        then: true,
                        else: false 
                    }
                }
            }
        },
        {
            $project: {
                fullname: 1,
                username: 1,
                email: 1,
                avatar: 1,
                coverImage: 1,
                followerCount: 1,
                followingCount: 1 ,
                isFollowed: 1
            }
        }
    ])

    if(!profile?.length){
        return res.status(400).json({"error": "profile does not existed"})
    }

    res.status(200).json(profile[0])
    // console.log(profile)
})

const getUser = asyncHandler( async (req, res) => {
   
    const { username } = req.params
    if(!username?.trim()){
        return res.status(400).json({"error": "username is missing"})
    }

    const userId = new mongoose.Types.ObjectId(req.user?.id);

    const profile = await User.aggregate([
        {
            $match: {
                username: username
            }
        },
        {
            $lookup: {
                from: "followers",
                localField: "_id",
                foreignField: "page",
                as: "Followers"
            }
        },
        {
            $lookup: {
                from: "followers",
                localField: "_id",
                foreignField: "follower",
                as: "Following"
            }
        },
        {
            $addFields: {
                currentUserId: userId
            }
        },
        {
            $addFields: {
                followerCount: {
                    $size: "$Followers"
                },
                followingCount: {
                    $size: "$Following"
                },
                isFollowed: {
                    $cond: {
                        if: {$in: ["$currentUserId", "$Followers.follower"]},
                        then: true,
                        else: false 
                    }
                }
            }
        },
        {
            $project: {
                fullname: 1,
                username: 1,
                email: 1,
                avatar: 1,
                coverImage: 1,
                followerCount: 1,
                followingCount: 1 ,
                isFollowed: 1
            }
        }
    ])

    if(!profile?.length){
        return res.status(400).json({"error": "profile does not existed"})
    }

    res.status(200).json(profile[0])
    // console.log(profile)
})


// TODO: logout, changeCurrentPassword, updateAccountDetail, updateAvatar, updateCoverImage

export { 
    registerUser,
    loginUser,
    getCurrentUser,
    getUser
}

