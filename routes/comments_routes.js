
const express = require('express');
const router = express.Router();
const Comment = require('../controllers/comments_controller');

router.post('/', Comment.createComment);

router.put('/:id', Comment.updateCommentById);

router.get('/post/:postId', Comment.getByPostId);

router.delete('/:id', Comment.deleteCommentById);


module.exports = router;