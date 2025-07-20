const mineflayer = require('mineflayer');
require('./server');
require('./keep_alive');

const botConfig = {
  host: 'SingedBeet-DBBE.aternos.me', // Replace this
  port: 22419,
  username: 'HerobrineAFK',
  auth: 'offline',
  version: '1.21.1',
};

const bot = mineflayer.createBot(botConfig);

bot.on('login', () => {
  console.log(`Bot logged in as ${bot.username}`);

  if (typeof global.updateBotStatus === 'function') {
    global.updateBotStatus({
      username: bot.username,
      server: `${botConfig.host}:${botConfig.port}`,
      isConnected: true,
      position: bot.entity?.position || { x: 0, y: 64, z: 0 },
      isMoving: false
    });
  }

  if (typeof global.updateBotInfo === 'function') {
    global.updateBotInfo({ username: bot.username, uuid: bot.uuid });
  }
});

bot.on('chat', (username, message) => {
  console.log(`${username}: ${message}`);

  if (typeof global.broadcastChatMessage === 'function') {
    global.broadcastChatMessage({ username, message });
  }
});

// 👟 Spooky movement
let isMoving = false;

function startHauntingMovement() {
  if (isMoving) return;
  isMoving = true;

  console.log("Herobrine is wandering...");

  const directions = [
    () => bot.setControlState("forward", true),
    () => bot.setControlState("back", true),
    () => bot.setControlState("left", true),
    () => bot.setControlState("right", true),
    () => bot.setControlState("jump", true),
  ];

  setInterval(() => {
    bot.clearControlStates();
    const move = directions[Math.floor(Math.random() * directions.length)];
    move();

    if (typeof global.updateBotStatus === 'function') {
      global.updateBotStatus({
        position: bot.entity?.position || { x: 0, y: 64, z: 0 },
        isMoving: true
      });
    }

    setTimeout(() => bot.clearControlStates(), 1000 + Math.random() * 2000);
  }, 3000 + Math.random() * 2000);
}

bot.once('spawn', startHauntingMovement);
