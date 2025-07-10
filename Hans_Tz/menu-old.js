const config = require('../config');
const { cmd } = require('../command');
const { runtime } = require('../lib/functions');
const os = require("os");
const path = require('path');
const axios = require('axios');
const fs = require('fs');

cmd({
    pattern: "menu3",
    desc: "menu the bot",
    category: "menu3",
    react: "⚡",
    filename: __filename
},
async (conn, mek, m, { from, sender, pushname, reply }) => {
    try {
        const dec = `
━〔 *𝐕𝐎𝐑𝐓𝐄𝐗-𝐗𝐌𝐃 MAIN MENU* 〕━
━━━━━━━━━━━━━━━━━━━━
> ┃✨ *Owner:* ${config.OWNER_NAME}
> ┃⚙️ *Mode:* ${config.MODE}
> ┃📡 *Platform:* Heroku
> ┃🧠 *Type:* NodeJs (Multi Device)
> ┃⌨️ *Prefix:* ${config.PREFIX}
> ┃🧾 *Version:* 3.0.0 Beta
━━━━━━━━━━━━━━━━━━━━

━〔 🧩 *COMMAND CATEGORIES* 〕━
━━━━━━━━━━━━━━━━━━━━
> ┃Quranmenu
> ┃Prayertime
> ┃Aimenu
> ┃Anmiemenu
> ┃Reactions
> ┃Convertmenu
> ┃Funmenu
> ┃Dlmenu
> ┃Listcmd
> ┃Mainmenu
> ┃Groupmenu
> ┃Allmenu
> ┃Ownermenu
> ┃Othermenu
> ┃Logo
> ┃Repo
━━━━━━━━━━━━━━━━━━━━
> 𝐕𝐎𝐑𝐓𝐄𝐗-𝐗𝐌𝐃
`;

        await conn.sendMessage(
            from,
            {
                image: { url: config.MENU_IMAGE_URL },
                caption: dec,
                contextInfo: {
                    mentionedJid: [m.sender],
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363352087070233@newsletter',
                        newsletterName: 'HansTech',
                        serverMessageId: 143
                    }
                }
            },
            { quoted: mek }
        );

        // Send local audio from assets/menu.m4a

const audioPath = path.join(__dirname, '../assets/menu.m4a');
await conn.sendMessage(from, {
    audio: fs.readFileSync(audioPath),
    mimetype: 'audio/mp4',
    ptt: true,
}, { quoted: mek });

    } catch (e) {
        console.error(e);
        reply(`❌ Error:\n${e}`);
    }
});

cmd({
    pattern: "logo",
    alias: ["logomenu"],
    desc: "menu the bot",
    category: "menu",
    react: "🧃",
    filename: __filename
}, 
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        let dec = `
> ━━━〔 *Logo List 〕━━━━━━
> ─────────────────
> ◈┃ neonlight
> ◈┃ blackpink
> ◈┃ dragonball
> ◈┃ 3dcomic
> ◈┃ america
> ◈┃ naruto
> ◈┃ sadgirl
> ◈┃ clouds
> ◈┃ futuristic
> ◈┃ 3dpaper
> ◈┃ eraser
> ◈┃ sunset
> ◈┃ leaf
> ◈┃ galaxy
> ◈┃ sans
> ◈┃ boom
> ◈┃ hacker
> ◈┃ devilwings
> ◈┃ nigeria
> ◈┃ bulb
> ◈┃ angelwings
> ◈┃ zodiac
> ◈┃ luxury
> ◈┃ paint
> ◈┃ frozen
> ◈┃ castle
> ◈┃ tatoo
> ◈┃ valorant
> ◈┃ bear
> ◈┃ typography
> ◈┃ birthday
━━━━━━━━━━━━━━━━━`;

        await conn.sendMessage(
            from,
            {
                image: { url: `https://files.catbox.moe/di5kdx.jpg` },
                caption: dec,
                contextInfo: {
                    mentionedJid: [m.sender],
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363352087070233@newsletter',
                        newsletterName: "HansTech",
                        serverMessageId: 143
                    }
                }
            },
            { quoted: mek }
        );

    } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
});

cmd({
    pattern: "reactions",
    desc: "Shows the reaction commands",
    category: "menu",
    react: "💫",
    filename: __filename
}, 
async (conn, mek, m, { from, quoted, reply }) => {
    try {
        let dec = `
> ━〔  Reactions Menu 〕━━━━━
> ─────────────────
> ◈┃ bully @tag
> ◈┃ cuddle @tag
> ◈┃ cry @tag
> ◈┃ hug @tag
> ◈┃ awoo @tag
> ◈┃ kiss @tag
> ◈┃ lick @tag
> ◈┃ pat @tag
> ◈┃ smug @tag
> ◈┃ bonk @tag
> ◈┃ yeet @tag
> ◈┃ blush @tag
> ◈┃ smile @tag
> ◈┃ wave @tag
> ◈┃ highfive @tag
> ◈┃ handhold @tag
> ◈┃ nom @tag
> ◈┃ bite @tag
> ◈┃ glomp @tag
> ◈┃ slap @tag
> ◈┃ kill @tag
> ◈┃ happy @tag
> ◈┃ wink @tag
> ◈┃ poke @tag
> ◈┃ dance @tag
> ◈┃ cringe @tag
━━━━━━━━━━━━━━━━━
> 𝐕𝐎𝐑𝐓𝐄𝐗-𝐗𝐌𝐃`;

        await conn.sendMessage(
            from,
            {
                image: { url: `https://files.catbox.moe/di5kdx.jpg` },
                caption: dec,
                contextInfo: {
                    mentionedJid: [m.sender],
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363352087070233@newsletter',
                        newsletterName: 'HansTech',
                        serverMessageId: 144
                    }
                }
            },
            { quoted: mek }
        );

    } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
});

// dlmenu

cmd({
    pattern: "dlmenu",
    desc: "menu the bot",
    category: "menu",
    react: "⤵️",
    filename: __filename
}, 
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        let dec = `
> ━〔 *Download Menu* 〕━┈⊷
> ─────────────────
> ◈┃ facebook
> ◈┃ mediafire
> ◈┃ tiktok
> ◈┃ twitter
> ◈┃ Insta
> ◈┃ apk
> ◈┃ img
> ◈┃ tt2
> ◈┃ pins
> ◈┃ apk2
> ◈┃ fb2
> ◈┃ pinterest 
> ◈┃ spotify
> ◈┃ play
> ◈┃ play2
> ◈┃ play3
> ◈┃ play4
> ◈┃ play5
> ◈┃ play6
> ◈┃ play7
> ◈┃ play8
> ◈┃ play9
> ◈┃ play10
> ◈┃ audio
> ◈┃ video
> ◈┃ video2
> ◈┃ video3
> ◈┃ video4
> ◈┃ video5
> ◈┃ video6
> ◈┃ video7
> ◈┃ video8
> ◈┃ video9
> ◈┃ video10
> ◈┃ ytmp3
> ◈┃ ytmp4
> ◈┃ song
> ◈┃ darama
> ◈┃ gdrive
> ◈┃ ssweb
> ◈┃ tiks
━━━━━━━━━━━━━━━━━
> 𝐕𝐎𝐑𝐓𝐄𝐗-𝐗𝐌𝐃`;

        await conn.sendMessage(
            from,
            {
                image: { url: `https://files.catbox.moe/di5kdx.jpg` },
                caption: dec,
                contextInfo: {
                    mentionedJid: [m.sender],
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363352087070233@newsletter',
                        newsletterName: 'HansTech',
                        serverMessageId: 143
                    }
                }
            },
            { quoted: mek }
        );

    } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
});

// group menu

cmd({
    pattern: "groupmenu",
    desc: "menu the bot",
    category: "menu",
    react: "⤵️",
    filename: __filename
}, 
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try
       {
        let dec = `
> ━━━〔 *Group Menu* 〕━━━━
> ─────────────────
> ◈┃ grouplink
> ◈┃ kickall
> ◈┃ kickall2
> ◈┃ kickall3
> ◈┃ add
> ◈┃ remove
> ◈┃ kick
> ◈┃ promote 
> ◈┃ demote
> ◈┃ dismiss 
> ◈┃ revoke
> ◈┃ setgoodbye
> ◈┃ setwelcome
> ◈┃ delete 
> ◈┃ getpic
> ◈┃ ginfo
> ◈┃ delete 
> ◈┃ disappear on
> ◈┃ disappear off
> ◈┃ disappear 7D,24H
> ◈┃ allreq
> ◈┃ updategname
> ◈┃ updategdesc
> ◈┃ joinrequests
> ◈┃ senddm
> ◈┃ nikal
> ◈┃ mute
> ◈┃ unmute
> ◈┃ lockgc
> ◈┃ unlockgc
> ◈┃ invite
> ◈┃ tag
> ◈┃ hidetag
> ◈┃ tagall
> ◈┃ tagadmins
━━━━━━━━━━━━━━━━━
> 𝐕𝐎𝐑𝐓𝐄𝐗-𝐗𝐌𝐃`;

        await conn.sendMessage(
            from,
            {
                image: { url: `https://files.catbox.moe/di5kdx.jpg` },
                caption: dec,
                contextInfo: {
                    mentionedJid: [m.sender],
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363352087070233@newsletter',
                        newsletterName: 'HansTech',
                        serverMessageId: 143
                    }
                }
            },
            { quoted: mek }
        );

    } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
});

// fun menu

cmd({
    pattern: "funmenu",
    desc: "menu the bot",
    category: "menu",
    react: "😎",
    filename: __filename
}, 
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {

        let dec = `
> ━━━━〔 *Fun Menu* 〕━━━━
> ─────────────────
> ◈┃ shapar
> ◈┃ rate
> ◈┃ insult
> ◈┃ hack
> ◈┃ ship
> ◈┃ character
> ◈┃ pickup 
> ◈┃ joke
> ◈┃ hrt
> ◈┃ hpy
> ◈┃ syd
> ◈┃ anger
> ◈┃ shy
> ◈┃ kiss
> ◈┃ mon
> ◈┃ cunfuzed
> ◈┃ setpp
> ◈┃ hand
> ◈┃ nikal
> ◈┃ hold
> ◈┃ hug
> ◈┃ nikal
> ◈┃ hifi
> ◈┃ poke
━━━━━━━━━━━━━━━━━
> 𝐕𝐎𝐑𝐓𝐄𝐗-𝐗𝐌𝐃`;

        await conn.sendMessage(
            from,
            {
                image: { url: `https://files.catbox.moe/di5kdx.jpg` },
                caption: dec,
                contextInfo: {
                    mentionedJid: [m.sender],
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363352087070233@newsletter',
                        newsletterName: 'HansTech',
                        serverMessageId: 143
                    }
                }
            },
            { quoted: mek }
        );

    } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
});

// other menu

cmd({
    pattern: "othermenu",
    desc: "menu the bot",
    category: "menu",
    react: "🤖",
    filename: __filename
}, 
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        let dec = `╭
> ━━〔 *Other Menu* 〕━━━━━
> ─────────────────
> ◈┃ timenow
> ◈┃ date
> ◈┃ count
> ◈┃ calculate
> ◈┃ countx
> ◈┃ flip
> ◈┃ coinflip
> ◈┃ rcolor
> ◈┃ roll
> ◈┃ fact
> ◈┃ cpp
> ◈┃ rw
> ◈┃ pair
> ◈┃ pair2
> ◈┃ pair3
> ◈┃ fancy
> ◈┃ logo <text>
> ◈┃ define
> ◈┃ news
> ◈┃ movie
> ◈┃ weather
> ◈┃ srepo
> ◈┃ insult
> ◈┃ save
> ◈┃ wikipedia
> ◈┃ gpass
> ◈┃ githubstalk
> ◈┃ yts
> ◈┃ ytv
━━━━━━━━━━━━━━━━━━
> 𝐕𝐎𝐑𝐓𝐄𝐗-𝐗𝐌𝐃`;

        await conn.sendMessage(
            from,
            {
                image: { url: `https://files.catbox.moe/di5kdx.jpg` },
                caption: dec,
                contextInfo: {
                    mentionedJid: [m.sender],
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363352087070233@newsletter',
                        newsletterName: 'HansTech',
                        serverMessageId: 143
                    }
                }
            },
            { quoted: mek }
        );

    } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
});

// main menu

cmd({
    pattern: "mainmenu",
    desc: "menu the bot",
    category: "menu",
    react: "🗿",
    filename: __filename
}, 
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        let dec = `
> ━━━〔 *Main Menu* 〕━━━━
> ─────────────────
> ◈┃ ping
> ◈┃ live 
> ◈┃ alive
> ◈┃ runtime
> ◈┃ uptime 
> ◈┃ repo
> ◈┃ owner
> ◈┃ menu
> ◈┃ menu2
> ◈┃ restart
━━━━━━━━━━━━━━━━━
> 𝐕𝐎𝐑𝐓𝐄𝐗-𝐗𝐌𝐃`;

        await conn.sendMessage(
            from,
            {
                image: { url: `https://files.catbox.moe/di5kdx.jpg` },
                caption: dec,
                contextInfo: {
                    mentionedJid: [m.sender],
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363352087070233@newsletter',
                        newsletterName: 'HansTech',
                        serverMessageId: 143
                    }
                }
            },
            { quoted: mek }
        );

    } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
});

// owner menu

cmd({
    pattern: "ownermenu",
    desc: "menu the bot",
    category: "menu",
    react: "🔰",
    filename: __filename
}, 
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        let dec = `
> ━━━〔 *Owner Menu* 〕━━━━
> ─────────────────
> ◈┃ owner
> ◈┃ menu
> ◈┃ menu2
> ◈┃ listcmd
> ◈┃ allmenu
> ◈┃ repo
> ◈┃ block
> ◈┃ unblock
> ◈┃ fullpp
> ◈┃ setpp
> ◈┃ restart
> ◈┃ shutdown
> ◈┃ updatecmd
> ◈┃ alive
> ◈┃ ping 
> ◈┃ gjid
> ◈┃ jid
━━━━━━━━━━━━━━━━━
> 𝐕𝐎𝐑𝐓𝐄𝐗-𝐗𝐌𝐃`;

        await conn.sendMessage(
            from,
            {
                image: { url: `https://files.catbox.moe/di5kdx.jpg` },
                caption: dec,
                contextInfo: {
                    mentionedJid: [m.sender],
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363352087070233@newsletter',
                        newsletterName: 'HansTech',
                        serverMessageId: 143
                    }
                }
            },
            { quoted: mek }
        );

    } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
});

// convert menu

cmd({
    pattern: "convertmenu",
    desc: "menu the bot",
    category: "menu",
    react: "🥀",
    filename: __filename
}, 
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        let dec = `
> ━━━〔 *Convert Menu* 〕━━━━
> ─────────────────
> ◈┃ sticker
> ◈┃ sticker2
> ◈┃ emojimix
> ◈┃ fancy
> ◈┃ take
> ◈┃ tomp3
> ◈┃ tts
> ◈┃ trt
> ◈┃ base64
> ◈┃ unbase64
> ◈┃ binary
> ◈┃ dbinary
> ◈┃ tinyurl
> ◈┃ urldecode
> ◈┃ urlencode
> ◈┃ url
> ◈┃ repeat 
> ◈┃ ask
> ◈┃ readmore
━━━━━━━━━━━━━━━━━
> 𝐕𝐎𝐑𝐓𝐄𝐗-𝐗𝐌𝐃`;

        await conn.sendMessage(
            from,
            {
                image: { url: `https://files.catbox.moe/di5kdx.jpg` },
                caption: dec,
                contextInfo: {
                    mentionedJid: [m.sender],
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363352087070233@newsletter',
                        newsletterName: 'HansTech',
                        serverMessageId: 143
                    }
                }
            },
            { quoted: mek }
        );

    } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
});


// anmie menu 

cmd({
    pattern: "animemenu",
    desc: "menu the bot",
    category: "menu",
    react: "🧚",
    filename: __filename
}, 
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
          let dec = `
> ━━━〔 *Anime Menu* 〕━━━━
> ─────────────────
> ◈┃ fack
> ◈┃ dog
> ◈┃ awoo
> ◈┃ garl
> ◈┃ waifu
> ◈┃ neko
> ◈┃ megnumin
> ◈┃ neko
> ◈┃ maid
> ◈┃ loli
> ◈┃ animegirl
> ◈┃ animegirl
> ◈┃ animegirl1
> ◈┃ animegirl2
> ◈┃ animegirl3
> ◈┃ animegirl4
> ◈┃ animegirl5
> ◈┃ anime1
> ◈┃ anime1
> ◈┃ anime2
> ◈┃ anime3
> ◈┃ anime4
> ◈┃ anime5
> ◈┃ animenews
> ◈┃ foxgirl
> ◈┃ naruto
━━━━━━━━━━━━━━━━━━
> 𝐕𝐎𝐑𝐓𝐄𝐗-𝐗𝐌𝐃`;

        await conn.sendMessage(
            from,
            {
                image: { url: `https://files.catbox.moe/di5kdx.jpg` },
                caption: dec,
                contextInfo: {
                    mentionedJid: [m.sender],
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363352087070233@newsletter',
                        newsletterName: 'HansTech',
                        serverMessageId: 143
                    }
                }
            },
            { quoted: mek }
        );

    } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
});


// ai menu 

cmd({
    pattern: "aimenu",
    desc: "menu the bot",
    category: "menu",
    react: "🤖",
    filename: __filename
}, 
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        let dec = `
> ━━━━〔 *Ai Menu* 〕━━━━━
> ─────────────────
> ◈┃ ai
> ◈┃ gpt3
> ◈┃ gpt2
> ◈┃ gptmini
> ◈┃ gpt
> ◈┃ meta
> ◈┃ blackbox
> ◈┃ luma
> ◈┃ dj 
> ◈┃ khan
> ◈┃ jawad
> ◈┃ gpt4
> ◈┃ bing
> ◈┃ imagine 
> ◈┃ imagine2
> ◈┃ copilot
━━━━━━━━━━━━━━━━━━
> 𝐕𝐎𝐑𝐓𝐄𝐗-𝐗𝐌𝐃`;

        await conn.sendMessage(
            from,
            {
                image: { url: `https://files.catbox.moe/di5kdx.jpg` },
                caption: dec,
                contextInfo: {
                    mentionedJid: [m.sender],
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363352087070233@newsletter',
                        newsletterName: 'HansTech',
                        serverMessageId: 143
                    }
                }
            },
            { quoted: mek }
        );

    } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
});
