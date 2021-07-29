const express = require('express');
const router = express.Router();
const methodOverride = require('method-override');
const { isLoggedIn, isAuthor } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const { cloudinary } = require('../cloudinary')
const upload  = multer({ storage });

const Posts = require('../models/post');
 

//HOME PAGE
router.get('/', isLoggedIn, async (req,res) => {
    const posts = await Posts.find({}).populate('author');
    // console.log(currentUser);
    res.render('home', {posts : posts});
});

//NEW POST
router.get('/createPost', isLoggedIn, (req,res) => {
    res.render('createPost');
});

router.post('/createPost', isLoggedIn, upload.array('image'), async (req,res) => {
    const newQuery = new Posts(req.body);
    newQuery.images = req.files.map(f => ({url: f.path, filename: f.filename}));
    newQuery.author= req.user._id;
    await newQuery.save();
    console.log(newQuery);
    req.flash('success', "Successfully created a new post!");
    res.redirect("/");
});


//SHOW PARTICULAR POST
router.get('/:id', isLoggedIn, async(req,res) => {
    const post = await Posts.findById(req.params.id).populate({
        path:'comments',
        populate: {
            path: 'author'
        }
    }).populate('author');
    res.render('show', {post: post});
});

//lIKE AND UNLIKE POST
router.put('/:id/like', isLoggedIn, async(req, res) => {
    const {id} = req.params;
    const addLike = Posts.findByIdAndUpdate(id, {
        $push:{
            likes:req.user._id
        }
    },
    {
        new:true
    }).exec();
    res.redirect("/");
});

router.put('/:id/unlike', isLoggedIn, async(req, res) => {
    const {id} = req.params;
    const addLike = Posts.findByIdAndUpdate(id, {
        $pull:{
            likes:req.user._id
        }
    },
    {
        new:true
    }).exec();
    res.redirect("/");
});


//EDIT and DELETE POST
router.get('/:id/edit', isLoggedIn, isAuthor, async (req,res) => {
    const {id} = req.params;
    const post = await Posts.findById(id);
    if (!post) {
        req.flash('error', 'cannot find that post!');
        return res.redirect('/');
    }
    res.render('edit', {post: post});
});

router.put('/:id', isLoggedIn, isAuthor, upload.array('image'), async (req,res) => {
    const {id} = req.params;
    const data = req.body;
    const post = await Posts.findByIdAndUpdate(id, data);
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}));
    post.images.push(...imgs);
    await post.save();
    if(req.body.deleteImages){
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
       await post.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}})
       console.log(post)

    }
    req.flash('success', 'successfully updated post!')
    res.redirect(`/${post._id}`);
});

router.delete('/:id', isLoggedIn, isAuthor, async (req,res) => {
    const {id} = req.params;
    const post = await Posts.findByIdAndDelete(id);
    res.redirect('/' );
});



module.exports = router;