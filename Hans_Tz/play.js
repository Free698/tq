const config = require('../config');
const { cmd, commands } = require('../command');
const fetch = require('node-fetch'); // Ensure node-fetch is installed or available
const { fetchJson } = require('../lib/myfunc'); // Adjust path if needed

cmd({
    pattern: "play",
    alias: ["ytplay", "ytmusic"],
    use: '.play <song name>',
    desc: "Play a song from YouTube.",
    category: "music",
    react: "🎵",
    filename: __filename
},
async (conn, mek, m, { from, text, sender, reply }) => {
    try {
        if (!text) return reply("Please provide a song name to search.");

        const start = new Date().getTime();

        const reactionEmojis = ['🎶', '🎵', '🎧', '🔊', '📻', '🎼', '🎤', '🎹', '🪕', '🥁'];
        const textEmojis = ['🎸', '🎺', '🎷', '🪗', '📀', '💿', '🎚️', '🔉', '🎙️', '🎛️'];

        const reactionEmoji = reactionEmojis[Math.floor(Math.random() * reactionEmojis.length)];
        let textEmoji = textEmojis[Math.floor(Math.random() * textEmojis.length)];

        // Ensure reaction and text emojis are different
        while (textEmoji === reactionEmoji) {
            textEmoji = textEmojis[Math.floor(Math.random() * textEmojis.length)];
        }

        // Send initial reaction
        await conn.sendMessage(from, {
            react: { text: textEmoji, key: mek.key }
        });

        // Search song
        const kyuu = await fetchJson(`https://api.agatz.xyz/api/ytsearch?message=${encodeURIComponent(text)}`);
        const songData = kyuu?.data?.[0];
        if (!songData) return reply("Song not found. Please try another search.");

        // Notify playing
        await conn.sendMessage(from, {
            text: `🎵 *Playing:* ${songData.title}`,
            contextInfo: {
                forwardingScore: 5,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterName: "𝐻𝒂𝒏𝒔𝑇𝒆𝒄𝒉",
                    newsletterJid: "120363352087070233@newsletter",
                },
                externalAdReply: {
                    title: "ʜᴀɴs-xᴍᴅ",
                    body: `HANSTZ`,
                    thumbnailUrl: songData.thumbnail || 'https://files.catbox.moe/fbfo1y.jpg',
                    sourceUrl: global.link,
                    mediaType: 1,
                    renderLargerThumbnail: true,
                    thumbnailHeight: 500,
                    thumbnailWidth: 500,
                },
            },
        }, { quoted: mek });

        // Get audio URL
        const tylor = await fetchJson(`https://api.nexoracle.com/downloader/yt-audio2?apikey=free_key@maher_apis&url=${songData.url}`);
        const audioUrl = tylor?.result?.audio;
        if (!audioUrl) return reply("Unable to fetch audio. Please try again.");

        // Send audio
        await conn.sendMessage(from, {
            audio: { url: audioUrl },
            fileName: `${songData.title}.mp3`,
            mimetype: "audio/mpeg",
            contextInfo: {
                forwardingScore: 5,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterName: "𝐻𝒂𝒏𝒔𝑇𝒆𝒄𝒉",
                    newsletterJid: "120363352087070233@newsletter",
                },
                externalAdReply: {
                    title: "ʜᴀɴs-xᴍᴅ",
                    body: `${songData.title}.mp3`,
                    thumbnailUrl: songData.thumbnail || 'https://files.catbox.moe/fbfo1y.jpg',
                    mediaType: 1,
                    renderLargerThumbnail: true,
                    thumbnailHeight: 500,
                    thumbnailWidth: 500,
                },
            },
        }, { quoted: mek });

        const end = new Date().getTime();
        const responseTime = (end - start) / 1000;

        console.log(`Song played in ${responseTime.toFixed(2)}s`);

    } catch (e) {
        console.error("Error in play command:", e);
        reply(`An error occurred: ${e.message}`);
    }
});