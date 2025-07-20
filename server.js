const express = require("express");
const path = require("path");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
require("./keep_alive");

let botStatus = {
  username: "HerobrineAFK",
  server: "Unknown",
  isConnected: false,
  isMoving: false,
  position: { x: 0, y: 64, z: 0 },
};

global.updateBotStatus = function (statusUpdate) {
  botStatus = { ...botStatus, ...statusUpdate };
  console.log("Bot status updated:", botStatus);
};

global.broadcastChatMessage = function (data) {
  // Broadcast chat message to connected clients
  io.emit("chatMessage", data);
};

global.botSendChat = function (message) {
  // This will be overridden by the bot when it connects
  console.log("Bot would send message:", message);
};

// Serve the main page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// API endpoints
app.get("/api/status", (req, res) => {
  res.json({ success: true, data: botStatus });
});

app.get("/api/bot/info", (req, res) => {
  res.json({
    success: true,
    data: {
      username: botStatus.username,
      server: botStatus.server,
      isConnected: botStatus.isConnected,
      isMoving: botStatus.isMoving,
      position: botStatus.position,
      uptime: process.uptime(),
    },
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
