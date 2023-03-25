const express = require('express');
const router = express.Router();

// Create
router.post('/', async (req, res) => {
	res.send('tweet post route');
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
