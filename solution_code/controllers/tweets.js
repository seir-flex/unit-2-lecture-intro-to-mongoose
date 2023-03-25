const express = require('express');
const router = express.Router();
const Tweet = require('../models/tweet.js');
const tweetSeed = require('../models/tweetSeed.js')


// Create
router.post('/', async (req, res) => {
	const tweet = await Tweet.create(req.body);
	res.send(tweet);
});

// Index
router.get('/', async (req, res) => {
	const tweets = await Tweet.find({});
	res.send(tweets);
});

// Seed
router.get('/seed', async (req, res) => {
    await Tweet.deleteMany({})
    await Tweet.create(tweetSeed);
    res.redirect('/tweets');
})

// Show
router.get('/:id', async (req, res) => {
	const tweet = await Tweet.findById(req.params.id);
	res.send(tweet);
});

// Delete
router.delete('/:id', async (req, res) => {
	const tweet = await Tweet.findByIdAndDelete(req.params.id);
	res.send({ success: true, tweet });
});

// Update
router.put('/:id', async (req, res) => {
	const tweet = await Tweet.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
	});
	res.send(tweet);
});

module.exports = router