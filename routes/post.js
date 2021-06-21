const express = require('express');
const router = express.Router();
const methodOverride = require('method-override');
const { isLoggedIn } = require('../middleware'); 

const Posts = require('../models/post');


//HOME PAGE
router.get('/', async (req,res) => {
    const posts = await Posts.find({});
    res.render('home', {posts : posts});
});

//NEW POST
router.get('/createPost', isLoggedIn, (req,res) => {
    res.render('createPost');
});

router.post('/createPost', isLoggedIn, async (req,res) => {
    const newQuery = new Posts(req.body);
    await newQuery.save();
    req.flash('success', "Successfully created a new post.");
    res.redirect("/");
});

//SHOW PARTICULAR POST
router.get('/:id', async(req,res) => {
    const post = await Posts.findById(req.params.id).populate('comments');
    res.render('show', {post: post});
});

//EDIT and DELETE POST
router.get('/:id/edit', isLoggedIn, async (req,res) => {
    const post = await Posts.findById(req.params.id);
    res.render('edit', {post: post});
});

router.put('/:id', isLoggedIn, async (req,res) => {
    const {id} = req.params;
    const data = req.body;
    const post = await Posts.findByIdAndUpdate(id, data);
    res.redirect(`/${post._id}`);
});

router.delete('/:id', isLoggedIn, async (req,res) => {
    const {id} = req.params;
    const post = await Posts.findByIdAndDelete(id);
    res.redirect('/' );
});

module.exports = router;