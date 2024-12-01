const postModel = require('../models/posts_model');
const commentModel = require('../models/comments_model');

const getAllPosts =  async (req, res) => {
    const senderFilter = req.query.sender;
    try{
        if(senderFilter){
            const posts = await postModel.find({sender: senderFilter});
            res.status(200).send(posts);
            
        } else{
            const posts = await postModel.find();
            res.status(200).send(posts);
        }
    } catch(error){
        res.status(400).send("Bad Request");
    }

};

const createPost = async (req, res) => {
    const post = req.body;
    try{
        const newPost = await postModel.create(post);
        res.status(201).send(newPost);

    }catch(error){
        res.status(400).send("Bad Request");

    }
};

const getPostById = async (req, res) => {
    const id = req.params.id;
    try{
        const post = await postModel.findById(id);
        if(post){
            res.status(200).send(post);
        } else{
            res.status(404).send('Post not found');
        }
    } catch(error){
        res.status(400).send("Bad Request");
    }

};

const updatePostById = async (req, res) => {
    const id = req.params.id;
    const post = req.body;
    try {
        await new postModel(post).validate();
        const oldPost = await postModel.findByIdAndUpdate(id, post);
        if (oldPost == null) {
            res.status(404).send('Post not found');
        } else {
            post._id = oldPost._id;
            res.status(201).send(post);
        }        
    } catch(error) {
        res.status(400).send("Bad Request");
    }
};

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

module.exports = {getAllPosts,createPost,getPostById,updatePostById,createComment};
