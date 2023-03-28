// import mongoose
const mongoose = require('mongoose')

// database configuration 
const DATABASE_URL =
	'mongodb+srv://admin:9qXBcu7n9JccCqZ@cluster0.yxzesjt.mongodb.net/?retryWrites=true&w=majority';

// mongoose connect to url
mongoose.connect(DATABASE_URL)

// export mongoose 
module.exports = { mongoose }