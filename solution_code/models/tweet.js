// import our db connection
const {mongoose} = require('../db/connection');

// import Schema
const Schema = mongoose.Schema

// create a tweet schema
const tweetSchema = new Schema({
    title: String,
    body: String,
    author: String,
    likes: {type: String, default: 0},
    sponsored: { type: Boolean, default: false}
},{timestamps: true})

// create Tweet model
const Tweet = mongoose.model('Tweet', tweetSchema)

module.exports = Tweet