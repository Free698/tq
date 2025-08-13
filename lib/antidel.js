const { isJidGroup } = require('@whiskeysockets/baileys');
const { loadMessage, getAnti } = require('../data');
const config = require('../config');
const fetch = require('node-fetch');

const DEFAULT_PROFILE_IMAGE = 'https://files.catbox.moe/zam9rp.jpg';

const getProfilePicture = async (conn, jid) => {
    try {
        const pp = await conn.profilePictureUrl(jid, 'image');
        if (pp) {
            return { url: pp };
        }
    } catch (e) {
        console.log('Error getting profile picture, using default');
    }
    return { url: DEFAULT_PROFILE_IMAGE };
};

const formatDeleteInfo = (info) => {
    return `
━━━━━━━━━━━━━━━━━━
🚀 *DELETED MESSAGE RECOVERED* 🚀
━━━━━━━━━━━━━━━━━━
> 📅 *Date:* ${info.date}
> ⏰ *Time:* ${info.time}
> 👤 *Sender:* @${info.sender}
> 🗑 *Deleted By:* @${info.deleter}
> 💬 *Chat:* ${info.chatName}
━━━━━━━━━━━━━━━━━━
> 📝 *Message:*

${info.messageContent}

━━━━━━━━━━━━━━━━━━
> 🔐 Vortex Anti-Delete`;
};

const DeletedText = async (conn, mek, jid, deleteInfo, senderJid, deleterJid) => {
    // Get profile pictures
    const senderPp = await getProfilePicture(conn, senderJid);
    const deleterPp = await getProfilePicture(conn, deleterJid);
    
    await conn.sendMessage(jid, {
        text: deleteInfo,
        contextInfo: {
            mentionedJid: [senderJid, deleterJid],
            forwardingScore: 5,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterName: "Vortex",
                newsletterJid: "120363352087070233@newsletter"
            },
        },
    }, { quoted: mek });
};

const DeletedMedia = async (conn, mek, jid, deleteInfo, senderJid, deleterJid) => {
    try {
        const antideletedmek = structuredClone(mek.message);
        const messageType = Object.keys(antideletedmek)[0];
        
        // Get profile pictures
        const senderPp = await getProfilePicture(conn, senderJid);
        const deleterPp = await getProfilePicture(conn, deleterJid);

        if (antideletedmek[messageType]) {
            antideletedmek[messageType].contextInfo = {
                stanzaId: mek.key.id,
                participant: senderJid,
                quotedMessage: mek.message,
                mentionedJid: [senderJid, deleterJid],
                forwardingScore: 5,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterName: "Vortex",
                    newsletterJid: "120363352087070233@newsletter"
                },
            };
        }

        if (messageType === 'imageMessage' || messageType === 'videoMessage') {
            antideletedmek[messageType].caption = deleteInfo;
        } else if (messageType === 'audioMessage' || messageType === 'documentMessage') {
            await conn.sendMessage(jid, {
                text: deleteInfo,
                contextInfo: {
                    mentionedJid: [senderJid, deleterJid],
                    forwardingScore: 5,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterName: "𝐕𝐎𝐑𝐓𝐄𝐗-𝐗𝐌𝐃",
                        newsletterJid: "120363352087070233@newsletter"
                    },
                },
            }, { quoted: mek });
        }

        await conn.relayMessage(jid, antideletedmek, {});
    } catch (error) {
        console.error('Error in DeletedMedia:', error);
    }
};

const AntiDelete = async (conn, updates) => {
    for (const update of updates) {
        if (update.update.message === null) {
            const store = await loadMessage(update.key.id);

            if (store && store.message) {
                const mek = store.message;
                const isGroup = isJidGroup(store.jid);
                const antiDeleteStatus = await getAnti();
                
                if (!antiDeleteStatus) continue;

                // Skip if the bot deleted its own message
                const deleterJid = update.key.participant || update.key.remoteJid;
                if (deleterJid === conn.user.id) continue;

                const deleteTime = new Date().toLocaleTimeString('en-GB', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                });
                
                const deleteDate = new Date().toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                });

                let deleteInfo, jid, senderJid, chatName;

                if (isGroup) {
                    const groupMetadata = await conn.groupMetadata(store.jid);
                    chatName = groupMetadata.subject;
                    senderJid = mek.key.participant || mek.key.remoteJid;
                    jid = config.ANTI_DEL_PATH === "inbox" ? conn.user.id : store.jid;
                } else {
                    chatName = "Private Chat";
                    senderJid = mek.key.remoteJid;
                    jid = config.ANTI_DEL_PATH === "inbox" ? conn.user.id : update.key.remoteJid;
                }

                const sender = senderJid.split('@')[0] || 'Unknown';
                const deleter = deleterJid.split('@')[0] || 'Unknown';
                const messageContent = mek.message?.conversation || 
                                    mek.message?.extendedTextMessage?.text || 
                                    'Media message';

                deleteInfo = formatDeleteInfo({
                    date: deleteDate,
                    time: deleteTime,
                    sender: sender,
                    deleter: deleter,
                    chatName: chatName,
                    messageContent: messageContent
                });

                if (mek.message?.conversation || mek.message?.extendedTextMessage) {
                    await DeletedText(conn, mek, jid, deleteInfo, senderJid, deleterJid);
                } else {
                    await DeletedMedia(conn, mek, jid, deleteInfo, senderJid, deleterJid);
                }
            }
        }
    }
};

module.exports = {
    DeletedText,
    DeletedMedia,
    AntiDelete,
};