const config = require('../config');
const { cmd, commands } = require('../command');
const axios = require('axios');

cmd({
    pattern: "vortex",
    alias: ["hanstech", "ask"],
    use: ".gpt <your message>",
    desc: "Chat with GPT AI",
    category: "ai",
    react: "🤖",
    filename: __filename
},
async (conn, mek, m, { from, text, sender, reply }) => {
    try {
        if (!text) return reply("Please enter a message to ask the AI.");

        // Send emoji reaction
        await conn.sendMessage(from, {
            react: { text: '🤖', key: mek.key }
        });

        // Store user chat history
        if (!global.userChats) global.userChats = {};
        if (!global.userChats[sender]) global.userChats[sender] = [];

        global.userChats[sender].push(`User: ${text}`);
        if (global.userChats[sender].length > 15) {
            global.userChats[sender].shift(); // Keep max 15 messages
        }

        const userHistory = global.userChats[sender].join("\n");

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

#### **Conversation History:**  
${userHistory}
`;

        // Get GPT response
        const { data } = await axios.get("https://mannoffc-x.hf.space/ai/logic", {
            params: { q: text, logic: prompt }
        });

        const botResponse = data?.result || "Sorry, I couldn't understand your question.";

        // Store bot response
        global.userChats[sender].push(`Bot: ${botResponse}`);

        // Get user profile picture or fallback
        let profilePic;
        try {
            profilePic = await conn.profilePictureUrl(sender, 'image');
        } catch {
            profilePic = 'https://files.catbox.moe/di5kdx.jpg'; // Default image
        }

        // Send AI response message
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
                    renderLargerThumbnail: false, // Small image
                    sourceUrl: global.link || "https://HansTz-tech.vercel.app"
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.error("Error in GPT command:", e);
        reply(`An error occurred: ${e.message}`);
    }
});