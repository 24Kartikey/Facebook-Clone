const express = require('express');
const router = express.Router({mergeParams: true});
const methodOverride = require('method-override');

const Posts = require('../models/post');
const Comments = require('../models/comment');


//NEW COMMENT
router.post('/', async (req, res) => {
    const post = await Posts.findById(req.params.id);
    const comment = new Comments(req.body.comment);
    post.comments.push(comment);
    await comment.save();
    await post.save();
    res.redirect(`/${post._id}`);
});

//DELETE COMMENT
router.delete('/:commentId', async (req, res) => {
    const {id, commentId} = req.params;
    await Posts.findByIdAndUpdate(id, { $pull: { comments: commentId} })
    await Comments.findByIdAndDelete(commentId);
    res.redirect(`/${id}`);
});


module.exports = router;