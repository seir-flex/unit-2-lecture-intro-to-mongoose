// Dependencies
const express = require('express');
const app = express();
const PORT = 3000

// middleware
app.use(express.urlencoded({extended: false}))

app.get('/', (req, res) => {
    res.send('default route')
})

const tweetsController = require('./controllers/tweets');
app.use('/tweets', tweetsController);

// Listener
app.listen(PORT, () => console.log(`express is listening on port: ${PORT}`));
