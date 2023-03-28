const express = require('express');
const router = express.Router();
// import the Tweet model
const Tweet = require('../models/tweet')

// async / await

// Create
router.post('/', async (req, res) => {
	// req.body has the data
	// create a new document in the collection
	// wait for this line of code to finish
	const tweet = await Tweet.create(req.body)
	// then do this thing
	res.send(tweet)
});

// Index
router.get('/', async (req, res) => {
	res.send('tweet index route');
});

// Seed
router.get('/seed', async (req, res) => {
	res.redirect('tweet seed route');
});

// Show
router.get('/:id', async (req, res) => {
	res.send('tweet show route');
});

// Delete
router.delete('/:id', async (req, res) => {
	res.send('tweet delete route');
});

// Update
router.put('/:id', async (req, res) => {
	res.send('tweet update route');
});

module.exports = router;
