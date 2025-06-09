const config = require('../config');
const { cmd, commands } = require('../command');
const axios = require('axios');

cmd({
    pattern: "gptvoice",
    alias: ["gptv", "gvoice", "aivoice"],
    use: ".gptvoice <question>",
    desc: "Ask GPT and get voice reply only",
    category: "ai",
    react: "🎤",
    filename: __filename
},
async (conn, mek, m, { from, text, sender, reply }) => {
    try {
        if (!text) return reply("Please type your question after the command.");

        // React
        await conn.sendMessage(from, {
            react: { text: '🎤', key: mek.key }
        });

        // Chat memory
        if (!global.userChats) global.userChats = {};
        if (!global.userChats[sender]) global.userChats[sender] = [];

        global.userChats[sender].push(`User: ${text}`);
        if (global.userChats[sender].length > 15) global.userChats[sender].shift();

        const history = global.userChats[sender].join("\n");

        const prompt = `
You are 𝐕𝐎𝐑𝐓𝐄𝐗-𝐗𝐌𝐃, a friendly and intelligent WhatsApp bot. Do not ask “How can I help you?”.

- Owner: HansTz
- GitHub: https://github.com/Mrhanstz/VORTEX-XMD
- Telegram: https://t.me/HansTzTech20
- YouTube: https://youtube.com/@HANSTZTECH
- WhatsApp: https://wa.me/255760774888

### Chat History:
${history}
`;

        // Get GPT text reply
        const { data } = await axios.get("https://mannoffc-x.hf.space/ai/logic", {
            params: {
                q: text,
                logic: prompt
            }
        });

        const gptReply = data?.result || "Sorry, I couldn’t respond.";

        // Save reply to memory
        global.userChats[sender].push(`Bot: ${gptReply}`);

        // Convert GPT response to voice (your TTS API)
        const ttsAudio = await axios.get("https://mannoffc-x.hf.space/api/speak", {
            params: {
                text: gptReply
            },
            responseType: "arraybuffer"
        });

        // Get user's profile picture or fallback
        let profilePic;
        try {
            profilePic = await conn.profilePictureUrl(sender, "image");
        } catch {
            profilePic = "https://files.catbox.moe/di5kdx.jpg";
        }

        // Send voice note reply
        await conn.sendMessage(from, {
            audio: ttsAudio.data,
            mimetype: "audio/mpeg",
            ptt: true,
            contextInfo: {
                forwardingScore: 5,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterName: "𝐻𝒂𝒏𝒔𝑇𝒆𝒄𝒉",
                    newsletterJid: "120363352087070233@newsletter",
                },
                externalAdReply: {
                    title: "𝐕𝐎𝐑𝐓𝐄𝐗-𝐗𝐌𝐃",
                    body: "AI Voice Response",
                    thumbnailUrl: profilePic,
                    mediaType: 1,
                    renderLargerThumbnail: false, // ✅ smaller image
                    sourceUrl: global.link || "https://HansTz-tech.vercel.app"
                }
            }
        }, { quoted: mek });

    } catch (err) {
        console.error("GPTVoice Error:", err);
        reply(`❌ Error: ${err.message}`);
    }
});