import { Router } from "express";
import {
    toggleFollowing,
    getUserFollower,
    getUserFollowing
} from "../controllers/follower.controller.js"
import { fetchUser } from "../middlewares/fetchUser.middleware.js";

const router = Router();

router.use(fetchUser);

// pageid === userid (user follows page)
router.route("/toggle-following/:pageid").post(toggleFollowing)

router.route("/get-user-followers/:id").get(getUserFollower)

router.route("/get-user-following/:id").get(getUserFollowing)

export default router