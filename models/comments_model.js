
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Posts',
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    },
    updatedAt: {
        type: Date,
        required: true
    },
    content: String,
    sender: {
        type: String,
        required: true
    },
}, {
   versionKey: false,
});

const CommentModel = mongoose.model('Comments', commentSchema);

module.exports = CommentModel;