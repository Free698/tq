const fs = require('fs');
const ai = require('unlimited-ai');
const googleTTS = require('google-tts-api');
const { cmd } = require('../command');

cmd({
  pattern: "gptvoice",
  alias: ["gptv", "gvoice"],
  use: ".gptvoice <your message>",
  desc: "GPT voice reply only (no text).",
  category: "ai",
  filename: __filename
},
async (conn, mek, m, { text, sender, from }) => {
  if (!text) return conn.sendMessage(from, { text: "❌ Please enter your message.\n\nExample: *.gptvoice hi*" }, { quoted: m });

  let conversationData = [];

  // Load previous conversation if exists
  try {
    const rawData = fs.readFileSync('store.json', 'utf8');
    if (rawData) {
      conversationData = JSON.parse(rawData);
      if (!Array.isArray(conversationData)) conversationData = [];
    }
  } catch {
    console.log('🟡 No existing conversation. Starting fresh.');
  }

  // Add user and system message
  const userMessage = { role: 'user', content: text };
  const systemMessage = {
    role: 'system',
    content: 'You are called Hans md. Developed by Ibrahim Adams. You respond to user commands. Only mention developer name if someone asks.'
  };
  conversationData.push(userMessage);
  conversationData.push(systemMessage);

  try {
    // Generate GPT response
    const model = 'gpt-4-turbo-2024-04-09';
    const aiResponse = await ai.generate(model, conversationData);

    // Save updated history
    conversationData.push({ role: 'assistant', content: aiResponse });
    fs.writeFileSync('store.json', JSON.stringify(conversationData, null, 2));

    // Convert response to TTS
    const audioUrl = googleTTS.getAudioUrl(aiResponse, {
      lang: 'en',
      slow: false,
      host: 'https://translate.google.com',
    });

    // Send voice note only
    await conn.sendMessage(from, {
      audio: { url: audioUrl },
      mimetype: 'audio/mp4',
      ptt: true,
      contextInfo: {
        forwardingScore: 5,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterName: "𝐻𝒂𝒏𝒔𝑇𝒆𝒄𝒉",
          newsletterJid: "120363352087070233@newsletter",
        }
      }
    }, { quoted: m });

  } catch (err) {
    console.error("❌ GPT Voice Error:", err);
    await conn.sendMessage(from, { text: "❌ An error occurred generating your voice reply. Please try again later." }, { quoted: m });
  }
});