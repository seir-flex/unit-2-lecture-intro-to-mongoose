// Dependencies
const express = require('express');
const app = express();
const PORT = 3000

app.get('/', (req, res) => {
    res.send('default route')
})

// Listener
app.listen(PORT, () => console.log(`express is listening on port: ${PORT}`));
