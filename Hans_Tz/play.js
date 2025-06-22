const config = require('../config');
const { cmd } = require('../command');
const fetch = require('node-fetch');
const { fetchJson } = require('../lib/myfunc');

// Shared handler for both play and video
const handleYouTubeDownload = async (conn, mek, m, { from, text, reply }, type) => {
    try {
        if (!text || (!text.includes("youtube.com") && !text.includes("youtu.be"))) {
            return reply("❗ Please provide a valid YouTube URL.");
        }

        const emojiList = ['🎶', '🎵', '🎧', '🔊', '📻', '🎼', '🎤', '🎹', '🪕', '🥁'];
        const chosenEmoji = emojiList[Math.floor(Math.random() * emojiList.length)];

        await conn.sendMessage(from, {
            react: { text: chosenEmoji, key: mek.key }
        });

        // Use the correct API based on type
        const apiUrl = type === 'audio'
            ? `https://apis.davidcyriltech.my.id/youtube/mp3?url=${encodeURIComponent(text)}`
            : `https://apis.davidcyriltech.my.id/download/ytmp4?url=${encodeURIComponent(text)}`;

        const data = await fetchJson(apiUrl);
        if (!data || !data.url) return reply(`❌ Failed to download ${type}. Please try again.`);

        const mediaInfo = {
            title: data.title || 'YouTube Media',
            thumbnail: data.thumbnail || 'https://files.catbox.moe/fbfo1y.jpg',
            url: data.url
        };

        // Send info message
        await conn.sendMessage(from, {
            text: `📥 *Downloading:* ${mediaInfo.title}\n🎞 Type: ${type.toUpperCase()}`,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterName: "𝐻𝒂𝒏𝒔𝑇𝒆𝒄𝒉",
                    newsletterJid: "120363352087070233@newsletter",
                },
                externalAdReply: {
                    title: "VORTEX-XMD BOT",
                    body: `${mediaInfo.title}`,
                    thumbnailUrl: mediaInfo.thumbnail,
                    sourceUrl: text,
                    mediaType: 1,
                    renderLargerThumbnail: true,
                },
            },
        }, { quoted: mek });

        // Prepare media options
        const mediaPayload = type === 'audio'
            ? {
                audio: { url: mediaInfo.url },
                fileName: `${mediaInfo.title}.mp3`,
                mimetype: 'audio/mpeg'
            }
            : {
                video: { url: mediaInfo.url },
                fileName: `${mediaInfo.title}.mp4`,
                mimetype: 'video/mp4'
            };

        // Send media
        await conn.sendMessage(from, {
            ...mediaPayload,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterName: "𝐻𝒂𝒏𝒔𝑇𝒆𝒄𝒉",
                    newsletterJid: "120363352087070233@newsletter",
                },
                externalAdReply: {
                    title: "VORTEX-XMD BOT",
                    body: `${mediaInfo.title}`,
                    thumbnailUrl: mediaInfo.thumbnail,
                    sourceUrl: text,
                    mediaType: 1,
                    renderLargerThumbnail: true,
                },
            }
        }, { quoted: mek });

    } catch (e) {
        console.error(`Error in command:`, e);
        return reply(`❌ Error:`);
    }
};

// 🎵 .play command - AUDIO
cmd({
    pattern: "play",
    alias: ["ytplay", "ytmusic"],
    use: ".play <YouTube URL>",
    desc: "Download audio from YouTube.",
    category: "music",
    react: "🎵",
    filename: __filename
}, async (conn, mek, m, details) => {
    return handleYouTubeDownload(conn, mek, m, details, "audio");
});

// 🎬 .video command - VIDEO
cmd({
    pattern: "video",
    alias: ["ytvideo", "ytmp4"],
    use: ".video <YouTube URL>",
    desc: "Download video from YouTube.",
    category: "video",
    react: "🎬",
    filename: __filename
}, async (conn, mek, m, details) => {
    return handleYouTubeDownload(conn, mek, m, details, "video");
});