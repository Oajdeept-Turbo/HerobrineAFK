const express = require('express');
const app = express();

app.get('/', (req, res) => res.send('👻 HerobrineAFK is haunting 24x7!'));

app.listen(3001, () => {
  console.log('🚨 Keep-alive server running on port 3000');
});
