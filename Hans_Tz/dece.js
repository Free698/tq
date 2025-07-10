const { cmd } = require('../command');

cmd({
    pattern: 'dice',
    alias: ['roll', 'rollDice'],
    use: '.dice',
    desc: 'Roll a dice and get a random number from 1 to 6.',
    category: 'game',
    react: '🎲',
    filename: __filename
}, async (conn, mek, m, { from, reply, sender }) => {
    try {
        // Roll a dice (1 to 6)
        const diceRoll = Math.floor(Math.random() * 6) + 1;

        // Fake quoted contact for styling
        const fakeQuoted = {
            key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
            message: {
                contactMessage: {
                    displayName: '🎲 Dice Game',
                    vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;Dice Game;;;\nFN:Dice Game\nitem1.TEL;waid=${sender.split('@')[0]}:${sender.split('@')[0]}\nitem1.X-ABLabel:Game\nEND:VCARD`,
                },
            },
        };

        // Dice faces emojis for fun
        const diceFaces = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

        const replyMsg = `
🎲 *Dice Roll Result*

You rolled a *${diceRoll}* ${diceFaces[diceRoll - 1]}!

Good luck next time! 🍀

*— 𝐕𝐎𝐑𝐓𝐄𝐗-𝐗𝐌𝐃 Bot*
        `;

        await conn.sendMessage(from, { text: replyMsg }, { quoted: fakeQuoted });

    } catch (error) {
        console.error('Error in dice command:', error);
        reply('Oops! Something went wrong rolling the dice.');
    }
});