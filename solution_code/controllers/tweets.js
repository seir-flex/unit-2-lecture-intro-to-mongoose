const express = require('express');
const router = express.Router();
// import the Tweet model
const Tweet = require('../models/tweet')

// async / await

// Create
router.post('/', async (req, res) => {
	// what is the key we are looking for that has the data?
	console.log('req.body', req.body)
	res.send(req.body);
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
