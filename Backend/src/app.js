import express from "express";
import cors from "cors";

const app = express()

app.use(cors())

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))

// routes import
import userRouter from "./routes/user.route.js";
import tweetRouter from "./routes/tweet.route.js"
import commentRouter from "./routes/comment.route.js";
import likeRouter from "./routes/like.route.js";
import followerRouter from "./routes/follower.route.js";

// route declaration
app.use("/api/v1/users", userRouter)
app.use("/api/v1/tweets", tweetRouter)
app.use("/api/v1/comments", commentRouter)
app.use("/api/v1/likes", likeRouter)
app.use("/api/v1/follower", followerRouter)

export { app }
