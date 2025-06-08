const { cmd } = require('../command');
const os = require("os");
const { runtime } = require('../lib/functions');
const config = require('../config');

cmd({
    pattern: "alive",
    alias: ["status", "online", "a"],
    desc: "Check bot is alive or not",
    category: "main",
    react: "⚡",
    filename: __filename
},
async (conn, mek, m, { from, sender, reply }) => {
    try {
        const status = `
> ━〔 *🤖 𝐕𝐎𝐑𝐓𝐄𝐗-𝐗𝐌𝐃 STATUS* 〕━━
> ⌛| *Uptime:* ${runtime(process.uptime())}
> 🧠| *Owner:* ${config.OWNER_NAME}
> ⚡| *Version:* 1.0.0
> 📝| *Prefix:* [${config.PREFIX}]
> 📳| *Mode:* [${config.MODE}]
> 🖥️| *Host:* ${os.hostname()}
━━━━━━━━━━━━━━━━━━━━━━
> 𝐕𝐎𝐑𝐓𝐄𝐗-𝐗𝐌𝐃`;

        await conn.sendMessage(from, {
            image: { url: config.MENU_IMAGE_URL },
            caption: status,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 1000,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363352087070233@newsletter',
                    newsletterName: '𝐕𝐎𝐑𝐓𝐄𝐗-𝐗𝐌𝐃',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.error("Alive Error:", e);
        reply(`An error occurred: ${e.message}`);
    }
});
