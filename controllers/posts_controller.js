const postModel = require('../models/posts_model');

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

module.exports = {getAllPosts,createPost,getPostById};
