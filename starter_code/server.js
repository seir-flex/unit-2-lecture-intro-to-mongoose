// DEPENDENCIES
const express = require('express');
const app = express();
const PORT = 3000

// DEFAULT ROUTE
app.get('/', (req, res) => {
    res.send('default route')
})

// TWEETS CONTROLLER
const tweetsController = require('./controllers/tweets');
app.use('/tweets', tweetsController);

app.listen(PORT, () => console.log(`express is listening on port: ${PORT}`));
