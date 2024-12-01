const postModel = require('../models/posts_model');
const commentModel = require('../models/comments_model');

const createComment = async (req, res) => {
    const comment = req.body;
    try {
        const post = await postModel.findById(comment.postId);
        if (post == null) {
            res.status(404).send('Post not found');
        } else {
            const utcNow = new Date().toISOString();
            comment.createdAt = utcNow;
            comment.updatedAt = utcNow;
            const newComment = await commentModel.create(comment);
            res.status(201).send(newComment);
        }
    } catch(error) {
        res.status(400).send("Bad Request");
    }
};

module.exports = {createComment};
