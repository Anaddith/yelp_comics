const express = require('express');
const router = express.Router();
const Comic = require('../models/comic')
const Comment = require('../models/comment');
const isLoggedIn = require('../utils/isLoggedIn');
const checkComicOwner = require('../utils/checkComicOwner');



//INDEX means showing all the items and from there you can select 
router.get("/comic", async (req, res) => {
	console.log(req.user);
	try{ //exception handling 
		const comic = await Comic.find().exec(); //instead of .then 
		res.render("comics", {comic});
	} catch (err) {
		console.log(err);
		res.send("you broke it... /index");
	}
	
})


//NEW, any input we give here in the form  they all go to the below create code
router.get("/comic/new", isLoggedIn, (req, res) => { //the input that we give in here, goes to the create code below
	res.render("comics_new");
})


//CREATE a new object in the database
router.post("/comic", isLoggedIn, async (req, res) => { // /comic is restful routing concept for creating 
	console.log(req.body)
	const genre = req.body.genre.toLowerCase();
	const newComic = {
		title: req.body.title,
		description: req.body.description,
		author: req.body.author,
		publisher: req.body.publisher,
		date: req.body.date, //date  is the name inside the html form for date 
		series: req.body.series,
		issue: req.body.issue, //issue is the name inside the html form for issue
		genre,
		color: !!req.body.color,
		image: req.body.image,
		owner: {
			id: req.user._id,
			username: req.user.username 
		}
	}
	
	try {
		const comic = await Comic.create(newComic)
		console.log(comic) 
		res.redirect("/comic/" + comic._id);  
	} catch (err) {
		console.log(err);
		res.send("You broke it... /comics POST")
	}
})

//Search : order of the SEARCH BLOCK is important 
router.get("/comic/search", async (req, res) => {
	try {
		const comic = await Comic.find({
			$text: {
				$search: req.query.term //look up to the documentation
			}
		});
		res.render("comics", {comic});
	} catch (err) {
		console.log(err);
		res.send("broken search")
	}
})



// Genre
router.get("/comic/genre/:genre", async (req,res) => {
	// Check if the given genre is valid 
	const validGenres = ["superhero", "manga", "slice-of-life", "sci-fi", "fantasy", "horror", "action", "nonfiction"];
	if(validGenres.includes(req.params.genre.toLowerCase())) {
			// If yes, continue
			const comic = await Comic.find({genre: req.params.genre}).exec();
		res.render("comics", {comic});
	} else {
			// If no, send an error 
			res.send("Please enter a valid genre");
	}
});






//SHOW, show means selecting and showing each item in particular 
router.get("/comic/:id", async (req, res) => { //instead of /comic
	try {
		const comic = await Comic.findById(req.params.id);
		const comments = await Comment.find({comicId: req.params.id});
		res.render("comics_show", {comic, comments})
	} catch (err) {
		console.log(err);
		res.send("You broke it... /comic/:id")
	}
})

//EDIT
router.get("/comic/:id/edit", checkComicOwner, async (req, res) => {
		const comic = await Comic.findById(req.params.id).exec();
		res.render("comics_edit", {comic});
})

//UPDATE
router.put("/comic/:id", checkComicOwner, async (req,res) => { // /comic/:id is restful routing concept for updating 
	const genre = req.body.genre.toLowerCase();
	const comics = {
		title: req.body.title,
		description: req.body.description,
		author: req.body.author,
		publisher: req.body.publisher,
		date: req.body.date,
		series: req.body.series,
		issue: req.body.issue,
		genre,
		color: !!req.body.color,
		image: req.body.image
	}
	try {
		const comic = Comic.findByIdAndUpdate(req.params.id, comics, {new: true}).exec()
		res.redirect(`/comic/${req.params.id}`)
	
	} catch (err) {
		console.log(err);
		res.send("Broken again... /comic/id PUT");
	}
	
})

//DELETE
router.delete("/comic/:id", isLoggedIn, checkComicOwner, (req, res) => {
	try {
		const comic = Comic.findByIdAndDelete(req.params.id).exec();
		//	console.log("Deleted:", deletedComic);
		res.redirect("/comic");
	} catch (err) {
		console.log(err);
		res.send("Brokennnnnn /comic/id DELETE");
	}
	
})


module.exports = router;