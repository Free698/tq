const fs = require('fs');
const googleTTS = require('google-tts-api');
const ai = require('unlimited-ai');

const { cmd } = require('../command');

cmd({
    pattern: "gptvoice",
    alias: ["gptv", "aivoice"],
    use: ".gptvoice <question>",
    desc: "Ask GPT and get a voice reply",
    category: "ai",
    react: "🎤",
    filename: __filename
},
async (conn, mek, m, { from, text, sender, reply }) => {
    try {
        if (!text) return reply("❗ Please type your message after the command.");

        // Load previous chat from store.json
        let conversationData = [];
        try {
            const rawData = fs.readFileSync('store.json', 'utf8');
            conversationData = Array.isArray(JSON.parse(rawData)) ? JSON.parse(rawData) : [];
        } catch {
            console.log("No previous conversation, starting new one.");
        }

        // Prepare user and system messages
        const model = 'gpt-4-turbo-2024-04-09';
        const userMessage = { role: 'user', content: text };
        const systemMessage = {
            role: 'system',
            content: 'You are called Vortex Xmd. Developed by Ibrahim Adams. You respond to user commands. Only mention developer name if someone asks.'
        };

        conversationData.push(userMessage, systemMessage);

        // Generate GPT response
        const gptResponse = await ai.generate(model, conversationData);
        conversationData.push({ role: 'assistant', content: gptResponse });

        // Save updated conversation
        fs.writeFileSync('store.json', JSON.stringify(conversationData, null, 2));

        // Convert response to audio
        const audioUrl = googleTTS.getAudioUrl(gptResponse, {
            lang: 'en',
            slow: false,
            host: 'https://translate.google.com',
        });

        // Try get profile picture or fallback
        let profilePic;
        try {
            profilePic = await conn.profilePictureUrl(sender, "image");
        } catch {
            profilePic = "https://files.catbox.moe/di5kdx.jpg";
        }

        // Send voice note as reply
        await conn.sendMessage(from, {
            audio: { url: audioUrl },
            mimetype: "audio/mp4",
            ptt: true,
            contextInfo: {
                forwardingScore: 5,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterName: "𝐻𝒂𝒏𝒔𝑇𝒆𝒄𝒉",
                    newsletterJid: "120363352087070233@newsletter",
                },
                externalAdReply: {
                    title: "ʜᴀɴs-xᴍᴅ",
                    body: "GPT Voice Reply",
                    thumbnailUrl: profilePic,
                    mediaType: 1,
                    renderLargerThumbnail: false,
                    sourceUrl: global.link || "https://HansTz-tech.vercel.app"
                }
            }
        }, { quoted: mek });

    } catch (err) {
        console.error("GPTVoice Error:", err);
        reply("❌ An error occurred. Try again later.");
    }
});