const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const axios = require('axios');
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// 🎯 Your Discord webhook
const DISCORD_WEBHOOK = 'https://discord.com/api/webhooks/1396359947922575360/gyhsSWffTwLLuP6nrcVW4AoZQMKFkzRP-4j0z_hYGfse7PSccZjKhySyj2qwb3_VjU-V';

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

app.use(express.static('public'));

const phrases = [
  "👁️ Herobrine sensed the watcher...",
  "🧿 A mortal touched the server...",
  "⚠️ He stirred beneath the code...",
  "💀 Echoes ripple through the socket...",
  "🪦 A presence has pinged the void..."
];

app.get('/ping', async (req, res) => {
  const message = phrases[Math.floor(Math.random() * phrases.length)];
  res.status(200).send(message);
  try {
    await axios.post(DISCORD_WEBHOOK, {
      content: `🔔 /ping triggered — ${message}`
    });
  } catch (err) {
    console.error('❌ Discord webhook failed:', err.message);
  }
});

app.get('/api/status', (req, res) => res.json(botStatus));
app.get('/api/bot/info', (req, res) => res.json(botInfo));

io.on('connection', (socket) => {
  console.log('🧿 Viewer connected');
  socket.on('error', (err) => {
    console.warn('⚠️ Socket error:', err.message || err);
  });
  socket.on('disconnect', (reason) => {
    console.warn(`🚪 Viewer disconnected (${reason})`);
  });
});

server.on('error', (err) => {
  if (err.code === 'ECONNRESET') {
    console.warn('⚠️ ECONNRESET – a ghost fled the connection...');
  } else {
    console.error('🔥 Server error:', err);
  }
});

server.listen(3000, () => {
  console.log('🧩 HerobrineAFK server running and whispering to Discord');
});

