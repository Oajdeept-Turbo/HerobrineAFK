const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server);

let botStatus = {};
let botInfo = {};

global.updateBotStatus = (status) => {
  botStatus = { ...botStatus, ...status };
};

global.updateBotInfo = (info) => {
  botInfo = { ...botInfo, ...info };
};

global.broadcastChatMessage = (msg) => {
  io.emit('chat', msg);
};

// Serve dashboard
app.use(express.static('public'));

// Status API
app.get('/api/status', (req, res) => res.json(botStatus));
app.get('/api/bot/info', (req, res) => res.json(botInfo));

// Root keep-alive endpoint
app.get('/', (req, res) => {
  res.send('✅ HerobrineAFK Express server alive');
});

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('🧿 Viewer connected');

  socket.on('error', (err) => {
    console.warn('⚠️ Socket error:', err.message || err);
  });

  socket.on('disconnect', (reason) => {
    console.warn(`🚪 Viewer disconnected (${reason})`);
  });
});

// Handle rare server errors
server.on('error', (err) => {
  if (err.code === 'ECONNRESET') {
    console.warn('⚠️ ECONNRESET – ghost dropped the connection...');
  } else {
    console.error('🔥 Server error:', err);
  }
});

server.listen(3000, () => console.log('🧩 Express + Socket.IO server fully patched and running'));
