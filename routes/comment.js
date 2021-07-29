const express = require('express');
const router = express.Router({mergeParams: true});
const methodOverride = require('method-override');
const {isLoggedIn, isCommentAuthor} = require('../middleware');

const Posts = require('../models/post');
const Comments = require('../models/comment');


//NEW COMMENT
router.post('/', isLoggedIn, async (req, res) => {
    const post = await Posts.findById(req.params.id);
    const comment = new Comments(req.body.comment);
    comment.author = req.user._id;
    post.comments.push(comment);
    await comment.save();
    await post.save();
    req.flash('success', 'Made new comment!');
    res.redirect(`/${post._id}`);
});


//DELETE COMMENT
router.delete('/:commentId', isLoggedIn, isCommentAuthor, async (req, res) => {
    const {id, commentId} = req.params;
    await Posts.findByIdAndUpdate(id, { $pull: { comments: commentId} })
    await Comments.findByIdAndDelete(commentId);
    req.flash('success', 'Comment deleted!');
    res.redirect(`/${id}`);
});


module.exports = router;