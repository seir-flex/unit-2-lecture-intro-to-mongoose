// Dependencies
const express = require('express');
const app = express();
const PORT = 3000;
const mongoose = require('mongoose');

// Middleware
// Body parser middleware: it creates req.body
app.use(express.urlencoded({ extended: false }));

// Database configuration
const DATABASE_URL =
	'mongodb+srv://admin:9qXBcu7n9JccCqZ@cluster0.yxzesjt.mongodb.net/carina?retryWrites=true&w=majority';
const db = mongoose.connection;
mongoose.connect(DATABASE_URL);

// Database Connection Error/Success
// Define callback functions for various events
// db.on('error', (err) => console.log(err.message + ' is mongod not running?'));
// db.on('connected', () => console.log('mongo connected'));
// db.on('disconnected', () => console.log('mongo disconnected'));

const Tweet = require('./models/tweet.js');

app.get('/', (req, res) => {
	res.send('default route');
});

// Create
app.post('/tweets', async (req, res) => {
	const tweet = await Tweet.create(req.body);
	res.send(tweet);
});

// Index
app.get('/tweets', async (req, res) => {
	const tweets = await Tweet.find({});
	res.send(tweets);
});

// Seed
app.get('/tweets/seed', async (req, res) => {
    await Tweet.deleteMany({})
    await Tweet.create([
			{
				title: 'Deep Thoughts',
				body: 'Friends, I have been navel-gazing',
				author: 'Karolin',
			},
			{
				title: 'Sage Advice',
				body: 'Friends, I am vegan and so should you',
				author: 'Karolin',
			},
			{
				title: 'Whole Reality',
				body: 'I shall deny friendship to anyone who does not exclusively shop at Whole Foods',
				author: 'Karolin',
			},
		]);
    res.send('seeded')
})

// Show
app.get('/tweets/:id', async (req, res) => {
	const tweet = await Tweet.findById(req.params.id);
	res.send(tweet);
});

// Delete
app.delete('/tweets/:id', async (req, res) => {
	const tweet = await Tweet.findByIdAndDelete(req.params.id);
	res.send({ success: true, tweet });
});

// Update
app.put('/tweets/:id', async (req, res) => {
	const tweet = await Tweet.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
	});
	res.send(tweet);
});

// Listener
app.listen(PORT, () => console.log(`express is listening on port: ${PORT}`));
