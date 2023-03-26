---
track: "Full-Stack Development"
title: "Intro to Mongoose"
week: 2
day: 1
type: "lecture"
---
# Intro to Mongoose


## Lesson Objectives

1. Explain what an ODM is
1. Connect to Mongo via text editor
1. Create a Schema for a collection
1. Create a model and save it
1. Find a specific model
1. Update a model already in the database
1. Remove a model already in the database
1. Combine actions



## Explain what is an ODM/Intro to Mongoose

ODM stand for Object Document Model. It translates the documents in Mongo into upgraded JavaScript Objects that have more helpful methods and properties when used in conjunction with express.

Rather than use the Mongo shell to create, read, update and delete documents, we'll use an npm package called `mongoose`. Mongoose will allow us to create schemas, do validations and make it easier to interact with Mongo inside an express app.

![Mongoose Visual](https://i.imgur.com/mx6edUc.png)


## Make a Schema

A schema will allow us to set specific keys in our objects. So if we have a key of `name`, we won't be able to insert other keys that don't match like `firstName` or `names`. This helps keep our data more organized and reduces the chance of errors.

We can also specify the datatypes. We can set the datatype of `name` to a `string`, `age` to a `number`, `dateOfBirth` to a Date, `bff` to a Boolean etc.

We can also make some fields required and we can set default values as well.

Here is a sample Schema, with many options. We'll be making a simpler variation of this

```js
const articleSchema = new Schema(
	{
		title: { type: String, required: true, unique: true }, //can say whether we want properties to be required or unique
		author: { type: String, required: true },
		body: String,
		comments: [{ body: String, commentDate: Date }], // can have arrays of objects with specific properties
		publishDate: { type: Date, default: Date.now }, // can set defaults for properties
		hidden: Boolean,
		meta: {
			// can have properties that are objects
			votes: Number,
			favs: Number,
		},
	},
	{ timestamps: true }
);
```

## Basic Set Up

- `mkdir tweeter`
- `cd tweeter`
- `touch server.js`
- `npm init -y` or go through the prompts
- `npm i express mongoose`
- `mkdir models`
- `touch models/tweet.js`
- `code .`


## Set Up A Basic Express Server

```js
// Dependencies
const express = require('express');
const app = express();
const PORT = 3000;

// Listener
app.listen(PORT, () => console.log(`express is listening on port: ${PORT}`));
```

Then check to make sure it's working.


## Set Up Mongoose

Inside `server.js`

- Require mongoose

```js
// Dependencies
const mongoose = require('mongoose');
```

- Head on over to [mongodb.com](https://www.mongodb.com/cloud/atlas) and generate a connection URI string
- Create a variable called DATABASE_URL and set it equal to your MongoDB Atlas connection string
- Update your DATABASE_URL to connect to the sub-database `tweeter` (if it doesn't exist, it will be created)
- set `mongoose.connection` to a shorter variable name - this is an object that represents your connection; there are some useful pieces of information we can read from it.

```js
// Database configuration
const DATABASE_URL =
	'mongodb+srv://sei:<password>@sei-w0kys.azure.mongodb.net/tweeter?retryWrites=true';
const db = mongoose.connection;
```

- Connect to MongoDB Atlas

```js
// Connect to MongoDB Atlas
mongoose.connect(DATABASE_URL);
```


Getting a warning like this?
![depreciation](https://i.imgur.com/47eb1oo.png)

Warnings are ok, it'll still work, for now. But in later versions it may stop working and you'll have to update your code. Notice how the message tells you exactly how to correct your code.

This should clear up the errors:

```js
mongoose.connect(DATABASE_URL, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
	useCreateIndex: true,
});
```
- **OPTIONAL and RECOMMENDED:** provide error/success messages about the connections. No need to memorize this code, just copy and paste it into your file.

```js

// Database Connection Error/Success
// Define callback functions for various events
db.on('error', (err) => console.log(err.message + ' is mongod not running?'));
db.on('connected', () => console.log('mongo connected'));
db.on('disconnected', () => console.log('mongo disconnected'));
```

## The entire configuration for mongoose:

Again: Don't memorize it, just set a bookmark and refer back to this as you need it. With the exception of the dependencies, this is the kind of stuff you might as well copy and paste from your previous apps because it mostly doesn't change. We'll be learning how to hide our DATABASE_URL soon and then it'll be totally copy and paste-able.

```js
// Dependencies
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = 3000;

// Database Configuration
const DATABASE_URL =
	'mongodb+srv://sei:<password>@sei-w0kys.azure.mongodb.net/tweeter?retryWrites=true';
const db = mongoose.connection;

// Database Connection
mongoose.connect(DATABASE_URL, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
	useCreateIndex: true,
});

// Database Connection Error/Success - optional but can be really helpful
db.on('error', (err) => console.log(err.message + ' is Mongod not running?'));
db.on('connected', () => console.log('mongo connected'));
db.on('disconnected', () => console.log('mongo disconnected'));

// App Listener
app.listen(PORT, () => console.log(`express is listening on port: ${PORT}`));
```

## Check Your Work

Before we go any further, let's check our work!
Boot up your server by running `nodemon` then check your terminal for a success or error message. Success? Awesome! This would be a great point to make a commit message if we were going to push this up to Github. Errors? Take a moment to fix them before we move on.


## Set Up Tweet Schema

In `models/tweet.js`

```js
const mongoose = require('mongoose'); // require mongoose
const Schema = mongoose.Schema; // create a shorthand for the mongoose Schema constructor

// create a new Schema
// This will define the shape of the documents in the collection
// Recource: https://mongoosejs.com/docs/guide.html
const tweetSchema = new Schema(
	{
		title: String,
		body: String,
		author: String,
		likes: { type: Number, default: 0 },
		sponsored: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

// Creating Tweet model : We need to convert our schema into a model-- will be stored in 'tweets' collection.  Mongo does this for you automatically
// Model's are fancy constructors compiled from Schema definitions
// An instance of a model is called a document.
// Models are responsible for creating and reading documents from the underlying MongoDB Database
// Resource: https://mongoosejs.com/docs/models.html
const Tweet = mongoose.model('Tweet', tweetSchema);

// Export Tweet model so it can be used in our controllers
module.exports = Tweet;
```

## Import Tweet Schema

Let's import that Tweet model alongside our other dependencies in the file that houses our controllers. For now, that's server.js. Soon we'll be moving our controllers to separate files and we'll have to move this import too.

In `server.js`

```js
// Dependencies
const Tweet = require('./models/tweet.js');
```

## Add Body Parser Middleware and Create a Create Route

This should all be done after your database connection and before your app listener

```js
// Middleware
// Body parser middleware: it creates req.body
app.use(express.urlencoded({ extended: false }));

// Routes / Controllers

// Create
app.post('/tweets', (req, res) => {
	res.send(req.body);
});
```

## Check Your Work with Postman

- Make a POST request to `http://localhost:3000/tweets`
- Under the 'Body' tab, select `x-www-form-urlencoded`
- Add some tweet data:

title: Deep Thoughts \
body: Friends, I have been navel-gazing \
author: Karolin

So your Postman looks like this when you send the request:

![Postman POST Request](https://i.imgur.com/SPHnGL1.png)


## Create a Document with Mongoose

In `server.js`

Let's make an object to insert into our database. When we connect with an express app, our data will be coming in to our controllers as an object (req.body) from the browser. So this will just be some dummy form data.

Now, let's code out the real functionality for our create route

```js
// Routes / Controllers
// Create
app.post('/tweets', async (req, res) => {
    const tweet = await Tweet.create(req.body)
    res.send(tweet)
});
```

## Check Your Work with Postman

Let's resend that same request we made earlier and see if it returns the new MongoDB document this time.

![Successful Postman Response](https://i.imgur.com/2KiFRGX.png)

Timestamps, deleted, and likes had default values, a unique \_id has been generated

## Add Two More Tweets via Postman

title: Sage Advice \
body: Friends, I am vegan and so should you \
author: Karolin

title: Whole Reality \
body: I shall deny friendship to anyone who does not exclusively shop at Whole Foods \
author: Karolin

## READ ROUTE: Find Documents with Mongoose

- Mongoose has 4 methods for this
- `find` - generic
- `findById` - finds by ID - great for Show routes!
- `findOne` - limits the search to the first document found
- [`where`](http://mongoosejs.com/docs/queries.html) - allows you to build queries, we won't cover this today

Let's create a Read route to find all Tweets. This will be our Index route \
Remember INDUCES (Index, New, Delete, Update, Create, Edit, Show) to help organize our routes so they don't conflict with each other.

```js
// Index
app.get('/tweets', async (req, res) => {
	const tweets = await Tweet.find({});
	res.send(tweets);
});
```

### Check Your Work with Postman

When you create a get request to `http://localhost:3000/tweets` you should now see all three tweets being returned.


## SHOW ROUTE: Find One Document with Mongoose

Remember INDUCES!

```js
// Show
app.get('/tweets/:id', async (req, res) => {
	const tweet = await Tweet.findById(req.params.id);
	res.send(tweet);
});
```

### Check Your Work With Postman

You're going to need an ID to complete this endpoint, so grab one that you know exists. If you need to find one, hit your index route again! Your endpoint should look something like this: `http://localhost:3000/tweets/60ba67d68e9a69446eb9bf00`

When you run it, you should get the tweet you took the ID from as a response.


## DESTROY ROUTE: Delete Documents with Mongoose

When it comes to deleting documents, we have a few options

- `remove()` danger! Will remove all instances
- `findOneAndRemove()` - this seems like a great choice
- `.findByIdAndDelete()`- finds by ID - great for delete routes in an express app!

Let's create a delete route. Remember INDUCES!

```js
// Delete
app.delete('/tweets/:id', async (req, res) => {
	const tweet = await Tweet.findByIdAndDelete(req.params.id);
	res.send({ success: true, tweet });
});
```

We could also `res.send(deletedTweet)`. Why might we want to do that? Because this would be our very last chance to use any of the data. Have you ever deleted your email address from a mailing list and they respond with something like "Hey Karolin! We're sorry to see you go. If this was an accident, click here to resubscribe!" This is a situation where your data has already been deleted from the database but they return the deleted object so they can use that data one last time to greet your with your name, and to have your email address ready to go if you click the button to reusubscribe. But if yoy're not going to use that data, you don't have to send it back.


### Check Your Work With Postman

You're going to need an ID to complete this endpoint, so grab one that you know exists. If you need to find one, hit your index route again! Your endpoint should look something like this: `http://localhost:3000/tweets/60ba67d68e9a69446eb9bf00` and it should be a DELETE request.


## UPDATE ROUTE: Edit Documents with Mongoose

Finally, we have a few options for updating

- `update()` - the most generic one
- `findOneAndUpdate()`- Let's us find one and update it
- `findByIdAndUpdate()` - Let's us find by ID and update - great for update/put routes in an express app!

Let's create an update route using findByIdAndUpdate. Remember INDUCES!
For this type of update we'll need to pass in the ID and the new data/

If we want to have our updated document returned to us in the callback, we have to set an option of `{new: true}` as the third argument. Otherwise, it will update our document, but return the old, un-updated document.

```js
// Update
app.put('/tweets/:id', async (req, res) => {
	const tweet = await Tweet.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
	});
	res.send(tweet);
});
```

## Add a Basic Seed Route

Let's practice adding a basic Seed route to our `Booklist` app

In `server.js` above the rest of your routes *(so it's easy to remember to remove it later)*:

```js
// Routes / Controllers
// Seed
app.get('/books/seed', (req, res) => {
    Book.create(
        [{
                title: 'Cracking the Coding Interview',
                author: 'Gayle Laakmann McDowell',
            },
            {
                title: 'HTML and CSS: Design and Build Websites',
                author: 'Jon Duckett',
            },
            {
                title: 'JavaScript and JQuery: Interactive Front-End Web Development ',
                author: 'jon Duckett',
            },
            {
                title: "You Don't Know JS Yet",
                author: 'Kyle Simpson',
            },
            {
                title: 'Design Patterns: Elements of Reusable Object-Oriented Software ',
                author: 'Erich Gamma',
            },
            {
                title: 'Frontend Unicorn',
                author: 'Michał Malewicz, Szymon Adamiak, Albert Pawłowski, and Albert Walicki',
            },
            {
                title: "Don't Make Me Think",
                author: 'Steve Krug',
            },
        ],
        (error, data) => {
            res.redirect('/books');
        }
    );
});
```

As you can see from the code above, we're using mongoose's create method just like we normally do, but instead of passing in a single object, we're passing in an array of objects. Each one will be it's own entry in the database.

You may also notice we're using a `GET` route instead of a POST route. We're going to be hitting this route from our browser and the code above will handle the data entry, so a simple `GET` route will do.







## STOP! Check your work.

In the browser, navigate to `http:localhost:3000/books/seed`

It should redirect to you `/books` and we should now see all the books from our seed route on the page.







## Gotcha!

Let's hit that seed route again: `http:localhost:3000/books/seed`
Once again, it should redirect you to `/books` but this time, you'll notice we have duplicate data. We've only coded create functionality into our seed route.

If we want to avoid the chance of duplicate data, the best option is to either run your seed route then comment it out so we can't accidentally seed again. OR to add some code to delete all of the entries in our database before creating the new entries.

Let's practice that too.

Update your code so include delete functionality:

```js
// Routes / Controllers
// Seed
app.get('/books/seed', (req, res) => {
    Book.deleteMany({}, (error, allBooks) => {});

    Book.create(
        [{
                title: 'Cracking the Coding Interview',
                author: 'Gayle Laakmann McDowell',
            },
            {
                title: 'HTML and CSS: Design and Build Websites',
                author: 'Jon Duckett',
            },
            {
                title: 'JavaScript and JQuery: Interactive Front-End Web Development ',
                author: 'jon Duckett',
            },
            {
                title: "You Don't Know JS Yet",
                author: 'Kyle Simpson',
            },
            {
                title: 'Design Patterns: Elements of Reusable Object-Oriented Software ',
                author: 'Erich Gamma',
            },
            {
                title: 'Frontend Unicorn',
                author: 'Michał Malewicz, Szymon Adamiak, Albert Pawłowski, and Albert Walicki',
            },
            {
                title: "Don't Make Me Think",
                author: 'Steve Krug',
            },
        ],
        (error, data) => {
            res.redirect('/books')
        }
    );
});
```







## STOP! Check your work.

Now, when you hit the seed route multiple times, you'll still only have one set of data.

Just remember, if you choose to include delete functionality in your seed routes, any data you've entered manually through a form or through postman will be lost. Use the seed route with care, and comment it out or delete it before deploying your app, unless it's a personal project for which you want to be able to restore your chosen data.







## Move Seed Data to a Separate file

Sometimes we have a lot of seed data and it takes up a lot of space in our controller. If you'd like to move the code to another file, you absolutely can!

In the `models` directory, let's create a file called `bookSeed.js` and move our seed data over:

```js
module.exports = [{
        title: 'Cracking the Coding Interview',
        author: 'Gayle Laakmann McDowell',
    },
    {
        title: 'HTML and CSS: Design and Build Websites',
        author: 'Jon Duckett',
    },
    {
        title: 'JavaScript and JQuery: Interactive Front-End Web Development ',
        author: 'jon Duckett',
    },
    {
        title: "You Don't Know JS Yet",
        author: 'Kyle Simpson',
    },
    {
        title: 'Design Patterns: Elements of Reusable Object-Oriented Software ',
        author: 'Erich Gamma',
    },
    {
        title: 'Frontend Unicorn',
        author: 'Michał Malewicz, Szymon Adamiak, Albert Pawłowski, and Albert Walicki',
    },
    {
        title: "Don't Make Me Think",
        author: 'Steve Krug',
    },
];
```

As you can see in the code above, we're now exporting our seed data from this file, which means we can import it elsewhere!

In `server.js`, let's update our code to use the exported data:

```js
// Routes / Controllers
// Seed
const bookSeed = require('./models/bookSeed.js');

app.get('/books/seed', (req, res) => {
	Book.deleteMany({}, (error, allBooks) => {});

	Book.create(bookSeed, (error, data) => {
		res.redirect('/books');
	});
});
```

We could import our `bookSeed` data at the top of the file with our dependencies, but it may be easier to remember to delete it if you keep all the seed related stuff together. To each their own!


## STOP! Check your work.

The functionlity should all be the same, the data is just coming from another file.


### Check Your Work With Postman

You're going to need an ID to complete this endpoint, so grab one that you know exists. If you need to find one, hit your index route again! Your endpoint should look something like this: `http://localhost:3000/tweets/60ba67d68e9a69446eb9bf00` and it should be a PUT request. You'll also need to change your data so we can see that the update worked. Change one of the field values before sending the request.

We can check out all the things we can do at the [Mongoose API docs](http://mongoosejs.com/docs/api.html)

## Congratulations! You've built a full CRUD APP with a real database! 🎉

This is all we need to know to build full CRUD apps with mongoose, but there's so much more you can do like sorting and filtering and finding by different parameters. When you have some free time, poke around [Mongoosejs.com](https://mongoosejs.com/) to learn about all the other options!

## HUNGRY FOR MORE?

- Add a view engine and turn this into an app that can be used from the browser.
- Add some error handling! When we use mongoose, we get back both an error and whatever we created, updated, deleted, etc.. If there's an error, do something with it!


