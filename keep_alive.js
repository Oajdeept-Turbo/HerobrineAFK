const express = require('express');
const app = express();

app.get('/', (req, res) => res.send('HerobrineAFK Codespace is alive'));
app.listen(3000, () => console.log('Keep_alive server running'));
