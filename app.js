// ========================
// IMPORTS
// ========================


//NPM Imports
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
//var morgan = require('morgan')
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const expressSession = require('express-session');

//Config Imports
try {
	var config = require('./config');
} catch (e) {
	console.log("Could not import config. This probably means you're not working locally.")
	console.log(e);
}


//Route Import
const comicRoutes = require('./routes/comics');
const commentRoutes = require('./routes/comments');
const mainRoutes = require("./routes/main");
const authRoutes = require("./routes/auth");

//Model Imports
const Comic = require('./models/comic');
const Comment = require('./models/comment');
const User = require('./models/user');

// ========================
//DEVELOPMENT
// ========================
// Morgan
//app.use(morgan('tiny'))


// Seed the DB
/*
const seed = require('./utils/seed');
seed(); 
*/


// ========================
// CONFIG
// ========================
 
// Connect to DB
try{
	mongoose.connect(config.db.connection, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true}); //create index is for search
} catch (e) {
	console.log("Could not connect using config. This probably means you're working locally.");
	mongoose.connect(process.env.DB_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
}


// Express Config
app.set("view engine", "ejs");
app.use(express.static('public')); //for using the public file CSS

// Express Session Config
app.use(expressSession({
	secret: process.env.ES_SECRET || config.expressSession.secret,
	resave: false,
	saveUninitialized: false
}));

// Body Parser Config
app.use(bodyParser.urlencoded({extended: true}));

// Method Override Config
app.use(methodOverride('_method'));


//Connect FLASH
app.use(flash());

//Passport Config
app.use(passport.initialize());
app.use(passport.session()); //Allows persistent sessions
passport.serializeUser(User.serializeUser()); //Encodes data into the session (passport-local-mongoose)
passport.deserializeUser(User.deserializeUser())//Decodes data from the session (passport-local-mongoose)
passport.use(new LocalStrategy(User.authenticate()));

//Current User Middleware Config aka STATE CONFIG
app.use((req, res, next) => {
	res.locals.user = req.user; //res.local is a value in the response object that's basically an object that we can add key value pairs on 
	res.locals.errorMessage = req.flash("error");//for sending the flsah msg to all pages 
	res.locals.successMessage = req.flash("success");
	next();
})




//Landing
app.get("/", (req, res) => {
	res.render("landing.ejs");
})

//Route Config
app.use(mainRoutes);
app.use(authRoutes);
app.use(comicRoutes); //instead of adding /comics everywhere we could use this to make it DRY
app.use(commentRoutes);


// ========================
//LISTEN
// ========================
app.listen(process.env.PORT || 3000, () => {
	console.log("yelp_comic is running...");
});

