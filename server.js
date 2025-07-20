const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// 🔄 Shared status data
let botStatus = {};
let botInfo = {};

// 🌐 Global methods for other files
global.updateBotStatus = (status) => {
  botStatus = { ...botStatus, ...status };
};

global.updateBotInfo = (info) => {
  botInfo = { ...botInfo, ...info };
};

global.broadcastChatMessage = (msg) => {
  io.emit('chat', msg);
};

// 📁 Static site for dashboard
app.use(express.static('public'));

// ✅ Keep-alive root
app.get('/', (req, res) => {
  res.send('✅ HerobrineAFK server is alive');
});

// 🧠 Status endpoints
app.get('/api/status', (req, res) => res.json(botStatus));
app.get('/api/bot/info', (req, res) => res.json(botInfo));

// 🧿 Handle viewer connections
io.on('connection', (socket) => {
  console.log('🧿 Viewer connected');

  socket.on('error', (err) => {
    console.warn('⚠️ Socket error:', err.message || err);
  });

  socket.on('disconnect', (reason) => {
    console.warn(`🚪 Viewer disconnected (${reason})`);
  });
});

// 🛡️ Catch server errors without crashing
server.on('error', (err) => {
  if (err.code === 'ECONNRESET') {
    console.warn('⚠️ ECONNRESET – a ghost fled the connection too fast.');
  } else {
    console.error('🔥 Server error:', err);
  }
});

// 🚀 Launch server
server.listen(3000, () => {
  console.log('🧩 Express + Socket.IO server fully patched and running');
});
