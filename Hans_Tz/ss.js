const config = require('../config');
const { cmd, commands } = require('../command');
const axios = require('axios');

cmd({
    pattern: "ss",
    alias: ["screenshot"],
    use: ".ss <url>",
    desc: "Capture a full screenshot of a website.",
    category: "tools",
    react: "🖼️",
    filename: __filename
},
async (conn, mek, m, { from, args, sender, reply }) => {
    try {
        const url = args[0];

        // If no URL, show usage instructions with small profile picture
        if (!url) {
            let ppUrl = 'https://files.catbox.moe/di5kdx.jpg'; // fallback
            try {
                ppUrl = await conn.profilePictureUrl(sender, 'image');
            } catch {}

            // Fetch and use small profile picture (or fallback)
            const thumb = await axios.get(ppUrl, { responseType: 'arraybuffer' }).then(res => res.data);

            return conn.sendMessage(from, {
                text: `👋 Hi @${sender.split("@")[0]}\n\nUse .ss <your link> to capture a screenshot.\n\nExample:\n*.ss https://example.com*`,
                contextInfo: {
                    mentionedJid: [sender],
                    forwardingScore: 5,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterName: "𝐻𝒂𝒏𝒔𝑇𝒆𝒄𝒉",
                        newsletterJid: "120363352087070233@newsletter"
                    },
                    externalAdReply: {
                        title: "📸 Screenshot Help",
                        body: "Use .ss <link>",
                        mediaType: 1,
                        thumbnail: thumb,
                        renderLargerThumbnail: false, // ✅ make it SMALL
                        showAdAttribution: true
                    }
                }
            }, { quoted: mek });
        }

        // Check link format
        if (!/^https?:\/\//.test(url)) {
            return reply("❌ Invalid URL. Make sure it starts with http:// or https://");
        }

        // Get screenshot from thum.io
        const screenshot = `https://image.thum.io/get/fullpage/${url}`;
        const imageBuffer = await axios.get(screenshot, { responseType: 'arraybuffer' }).then(res => res.data);

        await conn.sendMessage(from, {
            image: imageBuffer,
            caption: `📸 Screenshot of:\n${url}`,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 5,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterName: "𝐻𝒂𝒏𝒔𝑇𝒆𝒄𝒉",
                    newsletterJid: "120363352087070233@newsletter"
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.error('Error in .ss command:', e);
        reply("❌ Screenshot failed. The site may block previews or it's not supported.");
    }
});