const fs = require('fs');
const googleTTS = require('google-tts-api');
const ai = require('unlimited-ai');
const { cmd } = require('../command');

cmd({
  pattern: "gptvoice",
  alias: ["gptv", "aivoice"],
  use: ".gptvoice <your question>",
  desc: "Ask GPT and receive a voice reply",
  category: "ai",
  react: "🎤",
  filename: __filename
}, async (conn, mek, m, { from, text, sender, reply }) => {
  try {
    if (!text) return reply("❗ Please provide a question after the command.");

    await conn.sendMessage(from, { react: { text: '🎤', key: mek.key } });

    // Load or initialize conversation history
    let conversation = [];
    try {
      const raw = fs.readFileSync('store.json', 'utf8');
      conversation = Array.isArray(JSON.parse(raw)) ? JSON.parse(raw) : [];
    } catch {
      console.log("🟢 No previous conversation, starting fresh.");
    }

    // Append messages: user then system
    conversation.push({ role: 'user', content: text });
    conversation.push({
      role: 'system',
      content: 'You are called Hans md. Developed by Ibrahim Adams. You respond to user commands. Only mention developer name if someone asks.'
    });

    // Generate GPT response
    const gptAnswer = await ai.generate('gpt-4-turbo-2024-04-09', conversation);
    conversation.push({ role: 'assistant', content: gptAnswer });

    // Save updated conversation
    fs.writeFileSync('store.json', JSON.stringify(conversation, null, 2));

    // Generate TTS audio
    const audioUrl = googleTTS.getAudioUrl(gptAnswer, {
      lang: 'en',
      slow: false,
      host: 'https://translate.google.com',
    });

    // Fallback profile pic
    let profilePic = 'https://files.catbox.moe/di5kdx.jpg';
    try {
      profilePic = await conn.profilePictureUrl(sender, 'image');
    } catch {}

    // Send voice note reply
    await conn.sendMessage(from, {
      audio: { url: audioUrl },
      mimetype: 'audio/mp4',
      ptt: true,
      contextInfo: {
        forwardingScore: 5,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterName: "𝐻𝒂𝓷𝓈𝑇𝑒𝒸𝒉",
          newsletterJid: "120363352087070233@newsletter",
        },
        externalAdReply: {
          title: "𝐕𝐎𝐑𝐓𝐄𝐗-𝐗𝐌𝐃",
          body: "Vortex Voice Reply",
          thumbnailUrl: profilePic,
          mediaType: 1,
          renderLargerThumbnail: false,
          sourceUrl: global.link || "https://HansTz-tech.vercel.app"
        }
      }
    }, { quoted: mek });

  } catch (err) {
    console.error("❌ GPTVoice Error:", err);
    reply("❌ An error occurred generating your voice reply. Please try again later.");
  }
});