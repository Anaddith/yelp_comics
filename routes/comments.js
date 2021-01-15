const express = require('express');
const router = express.Router({mergeParams: true});
const Comment = require('../models/comment');
const Comic = require('../models/comic');
const isLoggedIn = require('../utils/isLoggedIn');
const checkCommentOwner = require('../utils/checkCommentOwner');



//New Comment - Show Form
router.get("/comic/:id/comments/new", isLoggedIn, (req, res) => {
	res.render("comments_new", {comicId: req.params.id})
})



//Create Comment - Actually Update DB
router.post("/comic/:id/comments", isLoggedIn, async (req, res) => {
	//Create the comment
	try {
		const comment = await Comment.create({
		user: {
			id: req.user._id,
			username: req.user.username 
		},
		text: req.body.text,
		comicId: req.body.comicId
	});
		console.log(comment);
		res.redirect(`/comic/${req.body.comicId}`)
	} catch (err) {
		console.log(err)
		res.send("Broken again...POST comments")
	}
})

//Edit Comment - Show the edit form
router.get("/comic/:id/comments/:commentId/edit", checkCommentOwner, async (req, res) => {
	try{
		const comic = await Comic.findById(req.params.id).exec(); //finds the comic id from the url
		const comment = await Comment.findById(req.params.commentId).exec();
		console.log("comic:", comic)
		console.log("comment:", comment)
		res.render("comments_edit", {comic, comment});
	} catch (err) {
		console.log(err);
		res.send("Broke Comment Edit GET")
	}
})

//Update Comment - Actually update in DB
router.put("/comic/:id/comments/:commentId", checkCommentOwner, async (req, res) => {
	try {
		const comment = await Comment.findByIdAndUpdate(req.params.commentId, {text: req.body.text}, {new: true}); //here the commentId inside the parameter is coming from the URL, req.body.text is coming from the forms 
		console.log(comment);
		res.redirect(`/comic/${req.params.id}`);  
	} catch (err) {
		console.log(err);
		res.send("Brokennnnnnn comment PUT")
	}
})

//Delete Comment - Duh...
router.delete("/comic/:id/comments/:commentId", checkCommentOwner, async(req, res) => {
	try {
		const comment = await Comment.findByIdAndDelete(req.params.commentId);
		console.log(comment);
		res.redirect(`/comic/${req.params.id}`);
	} catch (err) {
		console.log(err);
		res.send("Broken again comment DELETE")
	}
})


module.exports = router;