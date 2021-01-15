const Comic = require('../models/comic')
const Comment = require('../models/comment');

const comic_seeds = [
	{
		
		title: "Watchmen",
		description: "I'm baby four loko hashtag unicorn cardigan venmo. Yr chillwave swag glossier. Retro post-ironic tumblr, next level meggings shabby chic gochujang narwhal before they sold out. Cornhole raclette vape, everyday carry truffaut pabst drinking vinegar forage sriracha pitchfork small batch kale chips.",
		author: "Alan Moore",
		publisher: "DC",
		date: "2002-09-01",
		series: "Watchmen",
		issue: "1",
		genre: "superhero",
		color: true,
		image: "https://cdn.images.express.co.uk/img/dynamic/39/590x/secondary/Alan-Moore-and-Dave-Gibbons-comic-Watchmen-2122197.webp?r=1571687295758"
	
	},
	{	
		title: "Batman",
		description: "I'm baby four loko hashtag unicorn cardigan venmo. Yr chillwave swag glossier. Retro post-ironic tumblr, next level meggings shabby chic gochujang narwhal before they sold out. Cornhole raclette vape, everyday carry truffaut pabst drinking vinegar forage sriracha pitchfork small batch kale chips.",
		author: "Alan Moore",
		publisher: "DC",
		date: "2002-09-01",
		series: "Watchmen",
		issue: "1",
		genre: "superhero",
		color: true,
		image: "https://upload.wikimedia.org/wikipedia/commons/b/b9/Batman_Comic_Book_-_NARA_-_595420.gif"
	},
	{
		title: "Watchmen",
		description: "I'm baby four loko hashtag unicorn cardigan venmo. Yr chillwave swag glossier. Retro post-ironic tumblr, next level meggings shabby chic gochujang narwhal before they sold out. Cornhole raclette vape, everyday carry truffaut pabst drinking vinegar forage sriracha pitchfork small batch kale chips.",
		author: "Alan Moore",
		publisher: "DC",
		date: "2002-09-01",
		series: "Watchmen",
		issue: "1",
		genre: "superhero",
		color: true,
		image: "https://images-na.ssl-images-amazon.com/images/I/71MRrQzF6vL.jpg"
	}
]
const seed = async() => {
	//Delete all the current comics and comments 
	await Comic.deleteMany();
	console.log("Deleted All the Comics!")
	
	await Comment.deleteMany();
	console.log("Deleted All the Comments!");
	
	/* //Create three new comics 
	for (const comic_seed of comic_seeds){ //instead of for each, becoz of the inappropriate use of async
		let comic = await Comic.create(comic_seed);
		console.log("Created a new comic:", comic.title)
	//Create a new comment for each comic 
		await Comment.create({
			text: "I ruved this Romic Rook!",
			user: "scooby_doo",
			comicId: comic._id
		})
		console.log("Created a new comment!")
	} */
}


module.exports = seed;