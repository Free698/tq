const { cmd } = require('../command');

cmd({
    pattern: 'userinfo1',
    alias: ['user', 'whois'],
    use: '.userinfo <@user>',
    desc: 'Get basic info about a user.',
    category: 'info',
    react: 'ℹ️',
    filename: __filename
}, async (conn, mek, m, { from, text, quoted, reply, sender }) => {
    try {
        // If no mentioned user or text, use sender
        const mentioned = text || (quoted ? quoted.sender : sender);
        const userId = mentioned.split('@')[0];

        // Fake Quoted contact for nice quote style
        const fakeQuoted = {
            key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
            message: {
                contactMessage: {
                    displayName: `User Info - ${userId}`,
                    vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;User;;;\nFN:User\nitem1.TEL;waid=${userId}:${userId}\nitem1.X-ABLabel:Mobile\nEND:VCARD`,
                },
            },
        };

        // Basic info to show
        const userInfoMessage = `
👤 *User Information*

📱 WhatsApp ID: @${userId}
🔰 Mentioned By: @${sender.split('@')[0]}
📅 Checked at: ${new Date().toLocaleString()}

*Thanks for using 𝐕𝐎𝐑𝐓𝐄𝐗-𝐗𝐌𝐃 bot!*
        `;

        await conn.sendMessage(from, { 
            text: userInfoMessage, 
            contextInfo: { mentionedJid: [mentioned, sender] }
        }, { quoted: fakeQuoted });

    } catch (error) {
        console.error("Error in userinfo command:", error);
        reply("Something went wrong while fetching user info.");
    }
});