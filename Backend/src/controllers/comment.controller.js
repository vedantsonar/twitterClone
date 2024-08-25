import { Comment } from "../models/comment.model.js";

const addComment = async (req, res) => {

    try {
        const user = req.user?.id;
        if(!user){
            res.status(400).json({success, error: "Please login"})
        }
    
        const { content } = req.body;
        if(!content){
            res.status(404).json({success, error: "Content is required"})
        }
    
        const comment = await Comment.create({
            content,
            owner: user,
            tweet: req.params.tweetid
        })
    
        res.status(200).json({comment})
    } 
    catch (error) {
        console.error(error.message);
        res.status(500).send("An error occurred in add comment");
    }
}

const updateComment = async (req, res) => {
    try {
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({ error: "Content is required" });
        }

        let comment = await Comment.findById(req.params.commentid)
        // if (!comment) {
        //     return res.status(404).send("comment not found");
        // }

        if (comment.owner.toString() !== req.user.id) {
            return res.status(401).send("Not allowed, it belongs to another user");
        }

        comment = await Comment.findByIdAndUpdate(
            req.params.commentid,
            {  $set: {content} },
            { new: true}
        )

        res.json({ comment })
    } catch (error) {
        console.error(error.message);
        res.status(500).send("An error occurred in update comment");
    }
}

const deleteComment = async (req, res) => {
    try {
        let comment = await Comment.findById(req.params.commentid)
        // if(!comment) {
        //     res.status(404).send("comment not found")
        // }

        if (comment.owner.toString() !== req.user.id) {
            return res.status(401).send("Not allowed, it belongs to another user");
        }

        comment = await Comment.findByIdAndDelete(req.params.commentid)
        res.status(200).json({"Success": "comment has been deleted", comment})

    } catch (error) {
        console.error(error.message);
        res.status(500).send("An error occurred in delete comment");
    }
}

// Fetch all comments written on particular tweet
const fetchAllComment = async (req, res) => {
    try {
        
        const { tweetid } = req.params;

        // Find all comments for the specific tweet
        const comments = await Comment.find({ tweet: tweetid }).populate('owner', 'username avatar').exec();

        // Send the comments with owner details
        res.status(200).json(comments)
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Some error is occured in fetch comments");
    }
}

export {
    addComment,
    updateComment,
    deleteComment,
    fetchAllComment
}