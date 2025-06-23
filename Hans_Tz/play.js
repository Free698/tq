const config = require('../config');
const { cmd } = require('../command');
const fetch = require('node-fetch');
const yts = require("yt-search"); // Install with: npm install yt-search

// Your strict contextInfo structure for both audio and video
function getContextInfo(title, thumbnail, url) {
    return {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterName: "𝐻𝒂𝒏𝒔𝑇𝒆𝒄𝒉",
            newsletterJid: "120363352087070233@newsletter",
        },
        externalAdReply: {
            title: "𝐕𝐎𝐑𝐓𝐄𝐗-𝐗𝐌𝐃",
            body: title,
            thumbnailUrl: thumbnail,
            sourceUrl: url,
            mediaType: 1,
            renderLargerThumbnail: true,
            thumbnailWidth: 500,
            thumbnailHeight: 500,
        }
    };
}

// 🎵 Audio Command - .play
cmd({
    pattern: "play",
    alias: ["ytplay", "ytmusic"],
    use: ".play <song name>",
    desc: "Play a song from YouTube as audio.",
    category: "music",
    react: "🎵",
    filename: __filename
}, async (conn, mek, m, { from, text, reply }) => {
    try {
        if (!text) return reply("❗ Please enter a song name to search.");

        const yt = await yts(text);
        if (!yt?.videos?.length) return reply("❌ Song not found.");

        const song = yt.videos[0];
        const apiUrl = `https://apis.davidcyriltech.my.id/youtube/mp3?url=${encodeURIComponent(song.url)}`;

        const res = await fetch(apiUrl);
        const data = await res.json();

        if (!data?.result?.downloadUrl) return reply("❌ Download failed. Try again later.");

        await conn.sendMessage(from, {
            audio: { url: data.result.downloadUrl },
            fileName: `${song.title}.mp3`,
            mimetype: 'audio/mpeg',
            contextInfo: getContextInfo(song.title, song.thumbnail, song.url)
        }, { quoted: mek });

    } catch (err) {
        console.error("❌ Error in .play:", err);
        reply("An error occurred while processing your request.");
    }
});