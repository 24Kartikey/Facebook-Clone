const express = require('express'),
     bodyParser = require('body-parser'),
     mongoose = require('mongoose'),
     session = require('express-session'),
     flash = require('connect-flash'),
     methodOverride = require('method-override'),
     passport = require('passport'),
     LocalStrategy = require('passport-local');
     

const User = require('./models/user');


const userRoutes = require('./routes/user'); 
const postRoutes = require('./routes/post');
const commentRoutes = require('./routes/comment');


mongoose.connect('mongodb://localhost:27017/facebookClone', {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
        .then(() => {
        console.log("Connection Success!!")
    })
        .catch(err => {
        console.log("MongoDB error ocured!!!!");
        console.log(err);
    });


const app = express();

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride('_method'));

const sessionConfig = {
    secret: "dogNameIsTiger",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expire: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig)); 
app.use(flash());

app.use((req, res, next) =>  {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next(); 
});

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use('/', userRoutes); 
app.use('/', postRoutes);
app.use('/:id/comments', commentRoutes); 


//==========================

app.get('/friends', (req,res) => {
    res.render('friends');
});

app.get('/watch', (req,res) => {
    res.render('watch');
});


//===========================
app.listen(4000, () => {
    console.log("Server started at port 4000!");
});