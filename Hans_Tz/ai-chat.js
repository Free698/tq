const config = require('../config');
const { cmd, commands } = require('../command');
const axios = require('axios');

cmd({
    pattern: "gpt2",
    alias: ["vortex", "ask"],
    use: ".ask <your message>",
    desc: "Chat with GPT AI",
    category: "ai",
    react: "🤖",
    filename: __filename
},
async (conn, mek, m, { from, text, sender, reply }) => {
    try {
        if (!text) return reply("Please enter a message to ask the AI.");

        // React emoji
        await conn.sendMessage(from, {
            react: { text: '🤖', key: mek.key }
        });

        // Initialize user chat history
        if (!global.userChats) global.userChats = {};
        if (!global.userChats[sender]) global.userChats[sender] = [];

        // Add current user message to history
        global.userChats[sender].push(`User: ${text}`);
        if (global.userChats[sender].length > 15) {
            global.userChats[sender].shift();
        }

        const userHistory = global.userChats[sender].join("\n");

        // Prompt setup
        const prompt = `
You are 𝐕𝐎𝐑𝐓𝐄𝐗-𝐗𝐌𝐃, a friendly and intelligent WhatsApp bot. Chat naturally without asking repetitive questions, and do not ask, 'How can I assist you?'

- **Owner & Creator:** HansTz  
  - **WhatsApp:** [255760774888](https://wa.me/255760774888)  
  - **Telegram:** [t.me/HansTzTech20](https://t.me/HansTzTech20)
- **Portfolio:** [https://HansTz-tech.vercel.app](https://HansTz-tech.vercel.app)  
- **Channel:** [https://whatsapp.com/channel/0029VasiOoR3bbUw5aV4qB31](https://whatsapp.com/channel/0029VasiOoR3bbUw5aV4qB31)  
- **GitHub:** [https://github.com/Mrhanstz/HANS-XMD_V2](https://github.com/Mrhanstz/HANS-XMD_V2)  
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

        // Call GPT API
        const { data } = await axios.get("https://mannoffc-x.hf.space/ai/logic", {
            params: {
                q: text,
                logic: prompt
            }
        });

        const botResponse = data?.result || "Sorry, I couldn't respond to that.";

        // Add bot response to chat history
        global.userChats[sender].push(`Bot: ${botResponse}`);

        // Try to get user's profile picture
        let profilePic;
        try {
            profilePic = await conn.profilePictureUrl(sender, 'image');
        } catch (err) {
            profilePic = 'https://files.catbox.moe/di5kdx.jpg'; // Fallback image
        }

        // Send response with image + caption
        await conn.sendMessage(from, {
            image: { url: profilePic },
            caption: `👤 *User:* @${sender.split("@")[0]}\n\n🤖 *Hans-XMD AI Reply:*\n\n${botResponse}`,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true,
                externalAdReply: {
                    title: "𝐕𝐎𝐑𝐓𝐄𝐗-𝐗𝐌𝐃",
                    body: "Powered by HansTz",
                    mediaType: 1,
                    thumbnailUrl: profilePic,
                    sourceUrl: global.link || "https://HansTz-tech.vercel.app",
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.error("Error in GPT command:", e);
        reply(`An error occurred: ${e.message}`);
    }
});