const { cmd } = require('../command');
const { runtime } = require('../lib/functions');
const config = require('../config');

cmd({
    pattern: "uptime",
    alias: ["runtime", "up"],
    desc: "Show bot uptime with a clean professional format",
    category: "main",
    react: "⏱️",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        const uptime = runtime(process.uptime());
        const startTime = new Date(Date.now() - process.uptime() * 1000);

        const message = `
━━━━━━━━━━━━━━━━━━┓
> ◈┃  𝐕𝐎𝐑𝐓𝐄𝐗-𝐗𝐌𝐃  UPTIME 
━━━━━━━━━━━━━━━━━━┛
━━━━━━━━━━━━━━━━━━┓
> ◈┃Duration: ${uptime}
> ◈┃Start Time: ${startTime.toLocaleString()}
> ◈┃Stability: 100%
> ◈┃Version:  1.0.0
━━━━━━━━━━━━━━━━━━┛
`;

        await conn.sendMessage(from, { 
            text: message,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363352087070233@newsletter',
                    newsletterName: config.OWNER_NAME || 'HansTz',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.error("Uptime Error:", e);
        reply(`❌ Error: ${e.message}`);
    }
});