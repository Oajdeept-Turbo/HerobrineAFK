const mineflayer = require('mineflayer');
require('./server'); // Load global methods

const botConfig = {
  host: 'SingedBeet-DBBE.aternos.me', // Replace with your actual host
  port: 22419,
  username: 'HerobrineAFKK',
  auth: 'offline',
  version: '1.21.1'
};

const bot = mineflayer.createBot(botConfig);

bot.on('login', () => {
  console.log(`👻 Logged in as ${bot.username}`);
});

bot.once('spawn', () => {
  console.log('🕳️ Herobrine spawned.');

  global.updateBotStatus?.({
    username: bot.username,
    server: `${botConfig.host}:${botConfig.port}`,
    isConnected: true,
    position: bot.entity?.position || { x: 0, y: 64, z: 0 },
    isMoving: false
  });

  global.updateBotInfo?.({
    username: bot.username,
    uuid: bot.uuid
  });

  haunt();
});

bot.on('chat', (username, message) => {
  console.log(`${username}: ${message}`);
  global.broadcastChatMessage?.({ username, message });
});

function haunt() {
  const moves = ['forward', 'back', 'left', 'right', 'jump'];
  setInterval(() => {
    const move = moves[Math.floor(Math.random() * moves.length)];
    bot.setControlState(move, true);
    setTimeout(() => bot.clearControlStates(), 1000);

    global.updateBotStatus?.({
      position: bot.entity?.position || { x: 0, y: 64, z: 0 },
      isMoving: true
    });
  }, 3000 + Math.random() * 2000);
}
