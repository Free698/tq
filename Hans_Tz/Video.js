const { cmd } = require('../command');
const fetch = require('node-fetch');
const yts = require('yt-search');

const contextInfo = (m) => ({
    mentionedJid: [m.sender],
    forwardingScore: 5,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterName: "𝐻𝒂𝒏𝒔𝑇𝒆𝒄𝒉",
        newsletterJid: "120363352087070233@newsletter"
    }
});

cmd({
    pattern: "video",
    alias: ["ytvideo", "ytmp4"],
    use: ".video <song name>",
    desc: "Download YouTube video.",
    category: "video",
    react: "🎬",
    filename: __filename
},
async (conn, mek, m, { from, text, reply }) => {
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
            contextInfo: contextInfo(m)
        }, { quoted: mek });

    } catch (err) {
        console.error(err);
        reply("Error occurred while processing video.");
    }
});