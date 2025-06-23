const { cmd } = require('../command');
const fetch = require('node-fetch');
const yts = require('yt-search');

// Audio command
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
        if (!text) return reply("Please enter song name.");

        const yt = await yts(text);
        const song = yt.videos[0];
        if (!song) return reply("Song not found.");

        const apiUrl = `https://apis.davidcyriltech.my.id/youtube/mp3?url=${encodeURIComponent(song.url)}`;
        const res = await fetch(apiUrl);
        const data = await res.json();

        if (!data?.result?.downloadUrl) return reply("Audio download failed.");

        await conn.sendMessage(from, {
            audio: { url: data.result.downloadUrl },
            fileName: `${song.title}.mp3`,
            mimetype: "audio/mpeg",
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
        }, { quoted: mek });

    } catch (err) {
        console.error(err);
        reply("Error occurred while processing audio.");
    }
});

// Video command
cmd({
    pattern: "video",
    alias: ["ytvideo", "ytmp4"],
    use: ".video <video name>",
    desc: "Download YouTube video.",
    category: "video",
    react: "🎬",
    filename: __filename
}, async (conn, mek, m, { from, text, reply }) => {
    try {
        if (!text) return reply("Please enter video name.");

        const yt = await yts(text);
        const video = yt.videos[0];
        if (!video) return reply("Video not found.");

        const apiUrl = `https://apis.davidcyriltech.my.id/download/ytmp4?url=${encodeURIComponent(video.url)}`;
        const res = await fetch(apiUrl);
        const data = await res.json();

        if (data.status !== 200 || !data.success || !data.result.download_url) {
            return reply("Video download failed.");
        }

        await conn.sendMessage(from, {
            video: { url: data.result.download_url },
            fileName: `${video.title}.mp4`,
            mimetype: "video/mp4",
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 5,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterName: "𝐻𝒂𝒏𝒔𝑇𝒆𝒄𝒉",
                    newsletterJid: "120363352087070233@newsletter"
                }
            },
            caption: `🎥 *${video.title}*\n\n⏳ Duration: ${video.timestamp}\n👀 Views: ${video.views}\n📅 Uploaded: ${video.ago}\n\n🔗 ${video.url}`
        }, { quoted: mek });

    } catch (err) {
        console.error(err);
        reply("Error occurred while processing video.");
    }
});