// IMPORT MONGOOSE
const mongoose = require('mongoose');

// Database configuration
const DATABASE_URL =
	'mongodb+srv://admin:9qXBcu7n9JccCqZ@cluster0.yxzesjt.mongodb.net/carina?retryWrites=true&w=majority';
const db = mongoose.connection;
mongoose.connect(DATABASE_URL);

// Database Connection Error/Success
db.on('error', (err) => console.log(err.message + ' is mongod not running?'));
db.on('connected', () => console.log('mongo connected'));
db.on('disconnected', () => console.log('mongo disconnected'));

// EXPORT MONGOOSE
module.exports = { mongoose, db };
