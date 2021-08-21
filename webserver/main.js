const path = require('path');
const express = require('express');
const app = express();
const port = 80;

app.use(express.static(path.join(__dirname, 'build')));

app.listen(port, () => console.log("Frontend being served on port " + port));