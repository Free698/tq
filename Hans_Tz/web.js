const config = require('../config');
const { cmd, commands } = require('../command');
const axios = require('axios');
const cheerio = require('cheerio');

cmd({
    pattern: "web",
    alias: ["scrape", "source"],
    use: ".web <url>",
    desc: "Fetch full HTML, CSS, JS and media from a webpage as message.",
    category: "web",
    react: "🌍",
    filename: __filename
},
async (conn, mek, m, { from, quoted, sender, reply, args }) => {
    try {
        const start = new Date().getTime();

        const reactionEmojis = ['🌐', '💾', '📄', '🧠', '📡'];
        const textEmojis = ['📰', '📃', '📜', '🧾', '💻'];

        const reactionEmoji = reactionEmojis[Math.floor(Math.random() * reactionEmojis.length)];
        let textEmoji = textEmojis[Math.floor(Math.random() * textEmojis.length)];
        while (textEmoji === reactionEmoji) {
            textEmoji = textEmojis[Math.floor(Math.random() * textEmojis.length)];
        }

        await conn.sendMessage(from, {
            react: { text: textEmoji, key: mek.key }
        });

        const url = args[0];
        if (!url || !/^https?:\/\//.test(url)) {
            return reply("❌ Please provide a valid URL that starts with http:// or https://");
        }

        const res = await axios.get(url);
        const html = res.data;
        const $ = cheerio.load(html);

        const cssLinks = [];
        const jsLinks = [];
        const mediaLinks = [];

        $('link[rel="stylesheet"]').each((_, el) => {
            const href = $(el).attr('href');
            if (href) cssLinks.push(new URL(href, url).href);
        });

        $('script[src]').each((_, el) => {
            const src = $(el).attr('src');
            if (src) jsLinks.push(new URL(src, url).href);
        });

        $('img[src], audio[src], video[src]').each((_, el) => {
            const src = $(el).attr('src');
            if (src) mediaLinks.push(new URL(src, url).href);
        });

        // 🔹 Split long content into chunks
        const sendInChunks = async (label, content, maxLen = 4000) => {
            const chunks = content.match(new RegExp(`.{1,${maxLen}}`, 'gs'));
            for (let i = 0; i < chunks.length; i++) {
                await conn.sendMessage(from, {
                    text: `📦 *${label}* (Part ${i + 1}/${chunks.length}):\n\n${chunks[i]}`
                }, { quoted: mek });
            }
        };

        await sendInChunks("HTML Content", html);

        for (const cssURL of cssLinks) {
            try {
                const css = await axios.get(cssURL);
                await sendInChunks(`CSS: ${cssURL}`, css.data);
            } catch (e) {
                await reply(`⚠️ Failed to load CSS from: ${cssURL}`);
            }
        }

        for (const jsURL of jsLinks) {
            try {
                const js = await axios.get(jsURL);
                await sendInChunks(`JS: ${jsURL}`, js.data);
            } catch (e) {
                await reply(`⚠️ Failed to load JS from: ${jsURL}`);
            }
        }

        if (mediaLinks.length > 0) {
            await sendInChunks("Media Files", mediaLinks.join('\n'));
        } else {
            await reply("⚠️ No media files found.");
        }

        const end = new Date().getTime();
        const timeTaken = ((end - start) / 1000).toFixed(2);
        await reply(`✅ *Completed in ${timeTaken}s* ${reactionEmoji}`);

    } catch (err) {
        console.error("Error in .web command:", err);
        reply(`❌ Error: ${err.message}`);
    }
});