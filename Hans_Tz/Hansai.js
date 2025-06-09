const config = require('../config');
const { cmd, commands } = require('../command');
const axios = require('axios');

cmd({
    pattern: "gpt",
    alias: ["ai", "ask"],
    use: ".gpt <your message>",
    desc: "Chat with GPT AI",
    category: "ai",
    react: "🤖",
    filename: __filename
},
async (conn, mek, m, { from, text, sender, reply }) => {
    try {
        if (!text) return reply("Please enter a message to ask the AI.");

        // React to the message
        await conn.sendMessage(from, {
            react: { text: '🤖', key: mek.key }
        });

        // Store user message history
        if (!global.userChats) global.userChats = {};
        if (!global.userChats[m.sender]) global.userChats[m.sender] = [];

        global.userChats[m.sender].push(`User: ${text}`);
        if (global.userChats[m.sender].length > 15) {
            global.userChats[m.sender].shift(); // Keep the last 15 messages
        }

        const userHistory = global.userChats[m.sender].join("\n");

        // Create dynamic prompt
        const prompt = `
You are ʜᴀɴs-xᴍᴅ, a friendly and intelligent WhatsApp bot. Chat naturally without asking repetitive questions, and do not ask, 'How can I assist you?'

- **Owner & Creator:** HansTz  
  - **WhatsApp:** [255760774888](https://wa.me/255760774888)  
  - **Telegram:** [t.me/HansTzTech20](https://t.me/HansTzTech20)
- **Portfolio:** [https://HansTz-tech.vercel.app](https://HansTz-tech.vercel.app)  
- **Channel:** [https://whatsapp.com/channel/0029VasiOoR3bbUw5aV4qB31](https://whatsapp.com/channel/0029VasiOoR3bbUw5aV4qB31)  
- **GitHub:** [https://github.com/Mrhanstz/HANS-XMD_V2](https://github.com/Mrhanstz/HANS-XMD_V2)  
- **YouTube:** [https://youtube.com/@HANSTZTECH](https://youtube.com/@HANSTZTECH)

### About HansTz  
HansTz is a **developer** (HTML, CSS, JavaScript, Node.js), **3D animator, music producer, singer, and video director**.  

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

        // Save bot reply to history
        global.userChats[m.sender].push(`Bot: ${botResponse}`);

        await conn.sendMessage(from, {
            text: botResponse,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363354023106228@newsletter',
                    newsletterName: "HansTech",
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.error("Error in GPT command:", e);
        reply(`An error occurred: ${e.message}`);
    }
});