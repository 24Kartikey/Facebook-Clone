const express = require('express');
const passport = require('passport');

const router = express.Router();
const User = require('../models/user');


//REGISTER or SIGN UP
router.get('/register', (req, res) => {
     res.render('register'); 
});

router.post('/register', async (req, res) => {
    try {
        const {email, username, password } = req.body;
        const user = new User ({ email, username});
        const registerdUser = await User.register(user, password);
        res.redirect('/');
    } catch(err) {
        console.log(err);
        res.redirect('/register');
    }
});

//LOGIN or SIGN IN
router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', passport.authenticate('local', {failureRedirect: '/login' }), (req, res) => {
    res.redirect('/');
});

//LOGOUT
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});


module.exports = router;