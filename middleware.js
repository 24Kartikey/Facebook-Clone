const Posts = require('./models/post');
const Comments = require('./models/comment');

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.session.returnTo= req.originalUrl
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}

module.exports.isAuthor = async(req, res, next) => {
    const {id} = req.params;
    const post = await Posts.findById(id);
    if (!post.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/${id}`);
    }  
    next();
}



module.exports.isCommentAuthor = async(req, res, next) => {
    const { id, commentId} = req.params;
    const comment = await Comment.findById(commentId);
    if (!comment.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/${id}`);
    }  
    next();
}