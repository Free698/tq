const { cmd } = require('../command');
const config = require("../config");
const moment = require("moment-timezone");

const lifeQuotes = [
  "🤖 Powered by Vortex-Xmd – Smarter than ever! 🚀",
  "🔥 Auto-reacting, auto-working – No sleep mode! 😆",
  "💡 AI-powered and unstoppable – Like a tech wizard! 🧙‍♂️✨",
  "🎉 Fun fact: This bot never takes breaks! 😎",
  "⚡ Speed + AI = Vortex-Xmd! The ultimate chatbot. 💬",
  "📡 Connected worldwide – The future of automation! 🌐",
  "💥 Boom! Vortex-Xmd just made your chat cooler. 😜🔥",
  "🎭 AI with personality? That’s me! Fun & Smart. 😆",
  "🎯 Always ready – Messages, reactions, and more! 🤩",
  "🚀 Vortex-Xmd is here to level up your experience! 💯",
  "🤣 I make bots jealous with my uptime!",
  "😎 Running faster than your WiFi!",
  "⚙️ Vortex-Xmd: Where code meets comedy.",
  "🎬 This bot doesn’t just reply, it performs!",
  "🧠 Smart enough to roast you. Polite enough not to.",
];

let bioUpdateInterval = null;
let autoBioStarted = false;

const startAutoBio = async (conn) => {
  const updateBio = async () => {
    try {
      const time = moment().tz('Africa/Dar_es_Salaam').format('HH:mm:ss');
      const quote = lifeQuotes[Math.floor(Math.random() * lifeQuotes.length)];
      const status = `Vortex-Xmd | ${time} TZ | "${quote}"`;
      await conn.updateProfileStatus(status);
      console.log('[AUTO-BIO] Updated:', status);
    } catch (err) {
      console.error('[AUTO-BIO ERROR]', err);
    }
  };

  if (!bioUpdateInterval) {
    await updateBio();
    bioUpdateInterval = setInterval(updateBio, 60 * 1000); // update every 1 minute
  }
};

// Run AutoBio when bot starts handling messages
cmd({ on: "body" }, async (conn, m, msg, { from }) => {
  try {
    if (config.AUTO_BIO !== "true") return; // Auto-Bio OFF

    if (!autoBioStarted) {
      await startAutoBio(conn);
      autoBioStarted = true;
    }
  } catch (err) {
    console.error(err);
    m.reply(err.toString());
  }
});