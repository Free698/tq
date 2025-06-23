const { cmd } = require('../command');
const fetch = require('node-fetch');
const yts = require('yt-search');

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

        const fakeQuoted = {
            key: { fromMe: false, participant: `0@s.whatsapp.net`, remoteJid: 'status@broadcast' },
            message: {
                contactMessage: {
                    displayName: `𝐕𝐎𝐑𝐓𝐄𝐗-𝐗𝐌𝐃`,
                    vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;𝐕𝐎𝐑𝐓𝐄𝐗-𝐗𝐌𝐃;;;\nFN:𝐕𝐎𝐑𝐓𝐄𝐗-𝐗𝐌𝐃\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Mobile\nEND:VCARD`,
                },
            },
        };

        await conn.sendMessage(from, {
            video: { url: data.result.download_url },
            fileName: `${video.title}.mp4`,
            mimetype: "video/mp4",
            caption: `
🎥 *${video.title}*

⏳ Duration: ${video.timestamp}

👀 Views: ${video.views}

📅 Uploaded: ${video.ago}

🔗 ${video.url}

𝐕𝐎𝐑𝐓𝐄𝐗-𝐗𝐌𝐃`
        }, { quoted: fakeQuoted });

    } catch (err) {
        console.error(err);
        reply("Error occurred while processing video.");
    }
});
