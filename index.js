const mineflayer = require("mineflayer");
require("./server.js");
require("./keep_alive");

const botConfig = {
  host: "moose.aternos.host",
  port: 22419,
  username: "HerobrineAFK",
  auth: "offline",
  version: "1.21.1",
};

const bot = mineflayer.createBot(botConfig);

bot.on("login", () => {
  console.log("Bot logged in as " + bot.username);
  if (typeof global.updateBotStatus === "function") {
    global.updateBotStatus({
      username: bot.username,
      server: botConfig.host + ":" + botConfig.port,
      isConnected: true,
      position: bot.entity?.position || { x: 0, y: 64, z: 0 },
      isMoving: false,
    });
  }
});

bot.on("chat", (username, message) => {
  console.log(`${username}: ${message}`);
});

// Movement functionality
let isMoving = false;
let movementInterval = null;

function startRandomMovement() {
  if (isMoving) return;

  isMoving = true;
  console.log("Bot started moving");

 if (typeof global.updateBotStatus === 'function') {
  global.updateBotStatus('online');
  global.updateBotInfo({ username: bot.username, uuid: bot.uuid });
}


  movementInterval = setInterval(
    () => {
      if (!bot.entity) return;

      // Random movement directions
      const movements = [
        () => bot.setControlState("forward", true),
        () => bot.setControlState("back", true),
        () => bot.setControlState("left", true),
        () => bot.setControlState("right", true),
        () => bot.setControlState("jump", true),
      ];

      // Clear all movement states
      bot.clearControlStates();

      // Apply random movement
      const randomMovement =
        movements[Math.floor(Math.random() * movements.length)];
      randomMovement();

      // Update position status
      if (typeof global.updateBotStatus === "function") {
        global.updateBotStatus({
          position: bot.entity.position,
          isMoving: true,
        });
      }

      // Stop movement after a short time
      setTimeout(
        () => {
          bot.clearControlStates();
        },
        1000 + Math.random() * 2000,
      ); // 1-3 seconds
    },
    3000 + Math.random() * 2000,
  ); // Every 3-5 seconds
}

function stopMovement() {
  if (!isMoving) return;

  isMoving = false;
  console.log("Bot stopped moving");

  if (movementInterval) {
    clearInterval(movementInterval);
    movementInterval = null;
  }

  bot.clearControlStates();

  if (typeof global.updateBotStatus === "function") {
    global.updateBotStatus({ isMoving: false });
  }
}

// Start moving automatically after login
bot.on("spawn", () => {
  console.log("Bot spawned, starting movement in 5 seconds...");
  setTimeout(() => {
    startRandomMovement();
  }, 5000);
});

// Handle chat commands
bot.on("chat", (username, message) => {
  console.log(`${username}: ${message}`);

  if (message.toLowerCase().includes("stop")) {
    stopMovement();
  } else if (
    message.toLowerCase().includes("move") ||
    message.toLowerCase().includes("start")
  ) {
    startRandomMovement();
  }
});

// Override global function for bot chat
global.botSendChat = function (message) {
  if (bot && bot.chat) {
    bot.chat(message);
  }
};
