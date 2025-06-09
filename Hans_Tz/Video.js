const config = require('../config');
const { cmd, commands } = require('../command');
const { fetchJson } = require('../lib/myfunc');

cmd({
    pattern: "video",
    alias: ["ytvideo", "ytv"],
    use: '.video <video name>',
    desc: "Download and send a YouTube video.",
    category: "media",
    react: "🎬",
    filename: __filename
},
async (conn, mek, m, { from, text, sender, reply }) => {
    try {
        if (!text) return reply("Please provide a video name to search.");

        const start = new Date().getTime();

        const reactionEmojis = ['🎥', '🎬', '📽️', '📺', '📹', '📼', '🎞️', '🎦', '🔊', '🖥️'];
        const textEmojis = ['📽', '🎞', '🎬', '🎥', '📺', '📡', '🖥', '🎮', '🔊', '🧲'];

        const reactionEmoji = reactionEmojis[Math.floor(Math.random() * reactionEmojis.length)];
        let textEmoji = textEmojis[Math.floor(Math.random() * textEmojis.length)];

        while (textEmoji === reactionEmoji) {
            textEmoji = textEmojis[Math.floor(Math.random() * textEmojis.length)];
        }

        await conn.sendMessage(from, {
            react: { text: textEmoji, key: mek.key }
        });

        // Search for video
        const searchResult = await fetchJson(`https://api.agatz.xyz/api/ytsearch?message=${encodeURIComponent(text)}`);
        const videoData = searchResult?.data?.[0];
        if (!videoData) return reply("Video not found. Please try another search.");

        // Notify user
        await conn.sendMessage(from, {
            text: `📽 *Playing Video:* ${videoData.title}`,
            contextInfo: {
                forwardingScore: 5,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterName: "𝐻𝒂𝒏𝒔𝑇𝒆𝒄𝒉",
                    newsletterJid: "120363352087070233@newsletter",
                },
                externalAdReply: {
                    title: "𝐕𝐎𝐑𝐓𝐄𝐗-𝐗𝐌𝐃",
                    body: "HANSTZ",
                    thumbnailUrl: videoData.thumbnail || 'https://files.catbox.moe/fbfo1y.jpg',
                    sourceUrl: global.link,
                    mediaType: 1,
                    renderLargerThumbnail: true,
                    thumbnailHeight: 500,
                    thumbnailWidth: 500,
                },
            },
        }, { quoted: mek });

        // Fetch video download link
        const fetchVideo = await fetchJson(`https://api.nexoracle.com/downloader/yt-video2?apikey=free_key@maher_apis&url=${videoData.url}`);
        const videoUrl = fetchVideo?.result?.video;
        if (!videoUrl) return reply("Unable to fetch video. Please try again.");

        // Send video file
        await conn.sendMessage(from, {
            video: { url: videoUrl },
            fileName: `${videoData.title}.mp4`,
            mimetype: "video/mp4",
            caption: `🎬 *Title:* ${videoData.title}`
        }, { quoted: mek });

        const end = new Date().getTime();
        console.log(`Video sent in ${(end - start) / 1000}s`);

    } catch (e) {
        console.error("Error in video command:", e);
        reply(`An error occurred: ${e.message}`);
    }
});