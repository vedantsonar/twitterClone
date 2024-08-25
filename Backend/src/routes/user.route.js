import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js"
import { registerUser, loginUser, getCurrentUser, getUser } from "../controllers/user.controller.js";
import  { fetchUser }  from "../middlewares/fetchUser.middleware.js";

const router= Router()

router.route("/register").post(
    
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1 
        }
    ]),
    registerUser
)

router.route("/login").post(loginUser)

router.route("/getUser/:username").post(fetchUser, getUser)

router.route("/getUser").get(fetchUser, getCurrentUser)

export default router