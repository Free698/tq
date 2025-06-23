const { cmd } = require("../command");
const yts = require("yt-search");
const axios = require("axios");
const { generateWAMessageFromContent } = require("@whiskeysockets/baileys");

module.exports = {
  pattern: 'play',
  alias: ['song', 'ytmusic', 'audio'],
  react: '🎵',
  desc: 'Download YouTube audio',
  category: 'media',
  filename: __filename
};

cmd({
  pattern: 'play',
  alias: ['song', 'ytmusic', 'audio'],
  desc: 'Download YouTube audio',
  category: 'media'
}, async (m, sock, match) => {
  try {
    const query = match?.trim()?.split(' ').slice(1).join(' ');
    if (!query) return m.reply('❌ Please provide a search query or YouTube URL\n\nExample: .play baby shark');

    // Search for video
    const search = await yts(query);
    if (!search.videos.length) return m.reply('❌ No songs found');

    const song = search.videos[0];
    const apiUrl = `https://apis.davidcyriltech.my.id/youtube/mp3?url=${encodeURIComponent(song.url)}`;

    // Send processing message
    await m.reply(`⏳ Downloading: *${song.title}*\nDuration: ${song.timestamp}`);

    // Get audio stream
    const response = await axios.get(apiUrl, { responseType: 'stream' });
    if (!response.data) return m.reply('❌ Failed to download audio');

    // Prepare message with context info
    const message = {
      audio: { url: song.url },
      mimetype: 'audio/mpeg',
      ptt: false,
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 5,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterName: "𝐻𝒂𝒏𝒔𝑇𝒆𝒄𝒉",
          newsletterJid: "120363352087070233@newsletter"
        }
      },
      caption: `🎵 *${song.title}*\n\n⏳ Duration: ${song.timestamp}\n👀 Views: ${song.views}\n📅 Uploaded: ${song.ago}\n\n🔗 ${song.url}`
    };

    // Send audio
    await sock.sendMessage(m.chat, message, { quoted: m });

  } catch (error) {
    console.error('Audio download error:', error);
    m.reply('❌ Failed to download audio. Please try again later.');
  }
});