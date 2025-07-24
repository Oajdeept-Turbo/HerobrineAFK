// index.js
require('dotenv').config();
const express                    = require('express');
const mineflayer                 = require('mineflayer');
const { Client, GatewayIntentBits } = require('discord.js');

//
// 1. CONFIGURATION
//
const HOST               = '0.0.0.0';
const BASE_PORT          = 3001;
const DISCORD_TOKEN      = 'MTM5Mzg4MzQ0OTg5ODgzMTk2Mw.GtQUcN.q2XlsRejBzWk77zsiGnGiRG_yGf9c-V2uMdhoc';
const DISCORD_CHANNEL_ID = '1393889206417489993';
const MC_HOST            = 'SingedBeet-DBBE.aternos.me';
const MC_PORT            = 22419;
const MC_USERNAME        = 'SingedBeetBot';
const MC_VERSION         = '1.20.1';      // match your Aternos server’s version
const RECONNECT_DELAY    = 5000;          // ms between reconnect attempts

//
// 2. KEEP-ALIVE SERVER WITH AUTO-FALLBACK
//
const app = express();
function launchServer(port) {
  const srv = app.listen(port, HOST, () => 
    console.log(`✅ HTTP server at http://${HOST}:${port}`)
  );
  srv.on('error', err => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`⚠️ Port ${port} busy—trying ${port + 1}`);
      launchServer(port + 1);
    } else {
      console.error('🚨 HTTP error:', err);
      process.exit(1);
    }
  });
}
app.get('/ping', (req, res) => res.send('pong'));
launchServer(BASE_PORT);

//
// 3. DISCORD SETUP
//
const discord = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});
discord.once('ready', () => 
  console.log(`🤖 Discord logged in as ${discord.user.tag}`)
);
discord.login(DISCORD_TOKEN);

//
// 4. MINEFLAYER + RECONNECT LOGIC
//
function startMcBot() {
  const bot = mineflayer.createBot({
    host:     MC_HOST,
    port:     MC_PORT,
    username: MC_USERNAME,
    version:  MC_VERSION,
    auth:     'offline'
  });

  bot.on('login', () => 
    console.log(`🎮 MC bot connected as ${bot.username}`)
  );

  bot.on('chat', (username, msg) => {
    if (username === bot.username) return;
    const relay = `[MC] <${username}> ${msg}`;
    console.log(relay);

    const ch = discord.channels.cache.get(DISCORD_CHANNEL_ID);
    if (ch) ch.send(relay).catch(console.error);
  });

  bot.on('error', err => {
    console.error('🚨 Mineflayer error:', err.message || err);
  });

  bot.on('end', () => {
    console.warn(`🔄 Disconnected. Reconnecting in ${RECONNECT_DELAY / 1000}s...`);
    setTimeout(startMcBot, RECONNECT_DELAY);
  });

  bot.on('kicked', reason => {
    console.warn('👢 Kicked from server:', reason);
  });
}

startMcBot();
