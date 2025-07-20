const express = require('express');
const app = express();

app.get('/', (req, res) => res.send('HerobrineAFK is alive'));

module.exports = app; // Don't start a second server
