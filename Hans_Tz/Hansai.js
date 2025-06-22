const config = require('../config');
const { cmd } = require('../command');
const axios = require('axios');
const moment = require('moment-timezone');

const MAX_HISTORY = 100;
const RESET_INTERVAL = 3 * 60 * 60 * 1000; // 3 hours

if (!global.userChats) global.userChats = {};
if (!global.lastReset) global.lastReset = Date.now();

cmd({
    pattern: "gpt",
    alias: ["vortex", "ask", "hanstech"],
    use: ".gpt <your message>",
    desc: "Chat with GPT AI",
    category: "ai",
    react: "🤖",
    filename: __filename
}, async (conn, mek, m, { from, text, sender, reply }) => {
    try {
        if (!text) return reply("❌ Please enter a message to ask the AI.");

        // Auto-reset every 3 hours
        if (Date.now() - global.lastReset > RESET_INTERVAL) {
            global.userChats = {};
            global.lastReset = Date.now();
            console.log("✅ Chat memory reset after 3 hours.");
        }

        if (!global.userChats[sender]) global.userChats[sender] = [];
        global.userChats[sender].push(`User: ${text}`);
        if (global.userChats[sender].length > MAX_HISTORY) {
            global.userChats[sender].shift();
        }

        const userHistory = global.userChats[sender].join("\n");
        const currentTime = moment().tz('Africa/Dar_es_Salaam').format("YYYY/MM/DD HH:mm:ss");

        const prompt = `
You are 𝐕𝐎𝐑𝐓𝐄𝐗-𝐗𝐌𝐃, a friendly and intelligent WhatsApp bot. Chat naturally without asking repetitive questions, and do not ask, 'How can I assist you?'

- **Owner & Creator:** HansTz  
  - **WhatsApp:** [255760774888](https://wa.me/255760774888)  
  - **Telegram:** [t.me/HansTzTech20](https://t.me/HansTzTech20)
- **Portfolio:** [https://HansTz-tech.vercel.app](https://HansTz-tech.vercel.app)  
- **Channel:** [https://whatsapp.com/channel/0029VasiOoR3bbUw5aV4qB31](https://whatsapp.com/channel/0029VasiOoR3bbUw5aV4qB31)  
- **GitHub:** [https://github.com/Mrhanstz/VORTEX-XMD](https://github.com/Mrhanstz/VORTEX-XMD)  
- **YouTube:** [https://youtube.com/@HANSTZTECH](https://youtube.com/@HANSTZTECH)

### Bot Rules:  
- If a girl likes **HansTz**, share his WhatsApp link.  
- For songs: ".play song name"  
- For videos: ".video video name"  
- If insulted, match energy (e.g., "fuck you" => "fuck you too")  
- Always show love for your owner.

#### 🕒 Current Time:  
${currentTime}

#### **Conversation History:**  
${userHistory}
`;

        const { data } = await axios.get("https://mannoffc-x.hf.space/ai/logic", {
            params: { q: text, logic: prompt }
        });

        const botResponse = data?.result || "⚠️ Sorry, I couldn't understand your question.";

        global.userChats[sender].push(`Bot: ${botResponse}`);

        let profilePic = 'https://files.catbox.moe/di5kdx.jpg';
        try {
            profilePic = await conn.profilePictureUrl(sender, 'image');
        } catch {}

        await conn.sendMessage(from, {
            text: `👤 *User:* @${sender.split("@")[0]}\n\n🤖 *𝐕𝐎𝐑𝐓𝐄𝐗-𝐗𝐌𝐃 AI REPLY:*\n\n${botResponse}`,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 5,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterName: "𝐻𝒂𝒏𝒔𝑇𝒆𝒄𝒉",
                    newsletterJid: "120363352087070233@newsletter"
                },
                externalAdReply: {
                    title: "𝐕𝐎𝐑𝐓𝐄𝐗-𝐗𝐌𝐃",
                    body: "Powered by HansTz",
                    thumbnailUrl: profilePic,
                    mediaType: 1,
                    renderLargerThumbnail: false,
                    sourceUrl: global.link || "https://HansTz-tech.vercel.app"
                }
            }
        }, { quoted: mek });

    } catch (err) {
        console.error("❌ GPT Error:", err);
        reply("❌ An error occurred: " + err.message);
    }
});