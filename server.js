const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server);

let botStatus = {};
let botInfo = {};

global.updateBotStatus = (status) => { botStatus = status; };
global.updateBotInfo = (info) => { botInfo = info; };
global.broadcastChatMessage = (msg) => io.emit('chat', msg);

app.use(express.static('public'));

app.get('/api/status', (req, res) => res.json(botStatus));
app.get('/api/bot/info', (req, res) => res.json(botInfo));

io.on('connection', (socket) => {
  console.log("Viewer connected");
});

server.listen(3000, () => console.log("Socket.IO server running"));
