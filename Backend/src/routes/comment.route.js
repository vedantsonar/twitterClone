import { Router } from "express";
import {
    addComment,
    updateComment,
    deleteComment,
    fetchAllComment
} from "../controllers/comment.controller.js"
import { fetchUser } from "../middlewares/fetchUser.middleware.js";

const router = Router();

router.use(fetchUser);

router.route("/:tweetid").post(addComment)
router.route("/update-comment/:commentid").post(updateComment)
router.route("/delete-comment/:commentid").delete(deleteComment)

router.route("/fetch-all-comment/:tweetid").get(fetchAllComment)

export default router