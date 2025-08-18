//---------------------------------------------------------------------------
//           VORTEX-XMD
//---------------------------------------------------------------------------
//  ⚠️ DO NOT MODIFY THIS FILE ⚠️  
//---------------------------------------------------------------------------
const { cmd, commands } = require('../command');
const config = require('../config');
const prefix = config.PREFIX;
const fs = require('fs');
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, sleep, fetchJson } = require('../lib/functions2');
const { writeFileSync } = require('fs');
const path = require('path');

//---------------------------------------------------------------------------
// ADMIN COMMANDS
//---------------------------------------------------------------------------

cmd({
    pattern: "admin-events",
    alias: ["adminevents"],
    desc: "Enable or disable admin event notifications",
    category: "settings",
    filename: __filename
}, async (conn, mek, m, { from, args, isCreator, reply }) => {
    if (!isCreator) return reply("*📛 Only the owner can use this command!*");

    if (args[0] === "on") {
      config.ADMIN_EVENTS = "true";
      reply("✅ Admin event notifications are now enabled.");
    } else if (args[0] === "off") {
      config.ADMIN_EVENTS = "false";
      reply("❌ Admin event notifications are now disabled.");
    } else {
      reply(`Example: ${prefix}admin-events on/off`);
    }
});

//---------------------------------------------------------------------------
// BASIC SETTINGS COMMANDS
//---------------------------------------------------------------------------

cmd({
    pattern: "welcome",
    alias: ["welcomeset"],
    desc: "Enable or disable welcome messages",
    category: "settings",
    filename: __filename
}, async (conn, mek, m, { from, args, isCreator, reply }) => {
    if (!isCreator) return reply("*📛 Only the owner can use this command!*");

    if (args[0] === "on") {
      config.AUTO_BIO = "true";
      reply("✅ Welcome messages are now enabled.");
    } else if (args[0] === "off") {
      config.AUTO_BIO = "false";
      reply("❌ Welcome messages are now disabled.");
    } else {
      reply(`Example: ${prefix}welcome on/off`);
    }
});

//AUTO BIO CMDS
cmd({
    pattern: "autobio",
    alias: ["bio"],
    desc: "Enable or disable welcome messages",
    category: "settings",
    filename: __filename
}, async (conn, mek, m, { from, args, isCreator, reply }) => {
    if (!isCreator) return reply("*📛 Only the owner can use this command!*");

    if (args[0] === "on") {
      config.AUTO_BIO = "true";
      reply("✅ Welcome messages are now enabled.");
    } else if (args[0] === "off") {
      config.AUTO_BIO = "false";
      reply("❌ Welcome messages are now disabled.");
    } else {
      reply(`Example: ${prefix}welcome on/off`);
    }
});


cmd({
    pattern: "setprefix",
    alias: ["prefix"],
    desc: "Change the bot's command prefix",
    category: "settings",
    filename: __filename
}, async (conn, mek, m, { from, args, isCreator, reply }) => {
    if (!isCreator) return reply("*📛 Only the owner can use this command!*");

    const newPrefix = args[0];
    if (!newPrefix) return reply(`❌ Please provide a new prefix. Example: ${prefix}setprefix !`);
    
    config.PREFIX = newPrefix;
    reply(`✅ Prefix successfully changed to *${newPrefix}*`);
});

cmd({
    pattern: "mode",
    alias: ["setmode"],
    desc: "Set bot mode to private or public",
    category: "settings",
    filename: __filename
}, async (conn, mek, m, { from, args, isCreator, reply }) => {
    if (!isCreator) return reply("*📛 Only the owner can use this command!*");

    if (args[0] === "private") {
      config.MODE = "private";
      reply("✅ Bot mode is now set to PRIVATE.");
    } else if (args[0] === "public") {
      config.MODE = "public";
      reply("✅ Bot mode is now set to PUBLIC.");
    } else {
      reply(`Example: ${prefix}mode private/public`);
    }
});

//---------------------------------------------------------------------------
// AUTOMATION COMMANDS
//---------------------------------------------------------------------------

cmd({
    pattern: "auto-typing",
    alias: ["autotyping"],
    desc: "Enable or disable auto-typing",
    category: "settings",
    filename: __filename
}, async (conn, mek, m, { from, args, isCreator, reply }) => {
    if (!isCreator) return reply("*📛 Only the owner can use this command!*");

    if (args[0] === "on") {
      config.AUTO_TYPING = "true";
      reply("✅ Auto-typing is now enabled.");
    } else if (args[0] === "off") {
      config.AUTO_TYPING = "false";
      reply("❌ Auto-typing is now disabled.");
    } else {
      reply(`Example: ${prefix}auto-typing on/off`);
    }
});

cmd({
    pattern: "mention-reply",
    alias: ["mentionreply"],
    desc: "Enable or disable mention replies",
    category: "settings",
    filename: __filename
}, async (conn, mek, m, { from, args, isCreator, reply }) => {
    if (!isCreator) return reply("*📛 Only the owner can use this command!*");

    if (args[0] === "on") {
      config.MENTION_REPLY = "true";
      reply("✅ Mention replies are now enabled.");
    } else if (args[0] === "off") {
      config.MENTION_REPLY = "false";
      reply("❌ Mention replies are now disabled.");
    } else {
      reply(`Example: ${prefix}mention-reply on/off`);
    }
});

cmd({
    pattern: "always-online",
    alias: ["alwaysonline"],
    desc: "Enable or disable always online",
    category: "settings",
    filename: __filename
}, async (conn, mek, m, { from, args, isCreator, reply }) => {
    if (!isCreator) return reply("*📛 Only the owner can use this command!*");

    if (args[0] === "on") {
      config.ALWAYS_ONLINE = "true";
      reply("✅ Always online is now enabled.");
    } else if (args[0] === "off") {
      config.ALWAYS_ONLINE = "false";
      reply("❌ Always online is now disabled.");
    } else {
      reply(`Example: ${prefix}always-online on/off`);
    }
});

//---------------------------------------------------------------------------
// MEDIA COMMANDS
//---------------------------------------------------------------------------

cmd({
    pattern: "auto-recording",
    alias: ["autorecording"],
    desc: "Enable or disable auto-recording",
    category: "settings",
    filename: __filename
}, async (conn, mek, m, { from, args, isCreator, reply }) => {
    if (!isCreator) return reply("*📛 Only the owner can use this command!*");

    if (args[0] === "on") {
      config.AUTO_RECORDING = "true";
      reply("✅ Auto-recording is now enabled.");
    } else if (args[0] === "off") {
      config.AUTO_RECORDING = "false";
      reply("❌ Auto-recording is now disabled.");
    } else {
      reply(`Example: ${prefix}auto-recording on/off`);
    }
});

cmd({
    pattern: "auto-sticker",
    alias: ["autosticker"],
    desc: "Enable or disable auto-sticker",
    category: "settings",
    filename: __filename
}, async (conn, mek, m, { from, args, isCreator, reply }) => {
    if (!isCreator) return reply("*📛 Only the owner can use this command!*");

    if (args[0] === "on") {
      config.AUTO_STICKER = "true";
      reply("✅ Auto-sticker is now enabled.");
    } else if (args[0] === "off") {
      config.AUTO_STICKER = "false";
      reply("❌ Auto-sticker is now disabled.");
    } else {
      reply(`Example: ${prefix}auto-sticker on/off`);
    }
});

//---------------------------------------------------------------------------
// MESSAGE COMMANDS
//---------------------------------------------------------------------------

cmd({
    pattern: "read-message",
    alias: ["autoread"],
    desc: "Enable or disable read receipts",
    category: "settings",
    filename: __filename
}, async (conn, mek, m, { from, args, isCreator, reply }) => {
    if (!isCreator) return reply("*📛 Only the owner can use this command!*");

    if (args[0] === "on") {
      config.READ_MESSAGE = "true";
      reply("✅ Read receipts are now enabled.");
    } else if (args[0] === "off") {
      config.READ_MESSAGE = "false";
      reply("❌ Read receipts are now disabled.");
    } else {
      reply(`Example: ${prefix}read-message on/off`);
    }
});

cmd({
    pattern: "auto-reply",
    alias: ["autoreply"],
    desc: "Enable or disable auto-reply",
    category: "settings",
    filename: __filename
}, async (conn, mek, m, { from, args, isCreator, reply }) => {
    if (!isCreator) return reply("*📛 Only the owner can use this command!*");

    if (args[0] === "on") {
      config.AUTO_REPLY = "true";
      reply("✅ Auto-reply is now enabled.");
    } else if (args[0] === "off") {
      config.AUTO_REPLY = "false";
      reply("❌ Auto-reply is now disabled.");
    } else {
      reply(`Example: ${prefix}auto-reply on/off`);
    }
});

cmd({
    pattern: "auto-react",
    alias: ["autoreact"],
    desc: "Enable or disable auto-react",
    category: "settings",
    filename: __filename
}, async (conn, mek, m, { from, args, isCreator, reply }) => {
    if (!isCreator) return reply("*📛 Only the owner can use this command!*");

    if (args[0] === "on") {
      config.AUTO_REACT = "true";
      reply("✅ Auto-react is now enabled.");
    } else if (args[0] === "off") {
      config.AUTO_REACT = "false";
      reply("❌ Auto-react is now disabled.");
    } else {
      reply(`Example: ${prefix}auto-react on/off`);
    }
});

//---------------------------------------------------------------------------
// SECURITY COMMANDS
//---------------------------------------------------------------------------

cmd({
    pattern: "anti-bad",
    alias: ["antibad"],
    desc: "Enable or disable anti-bad words",
    category: "settings",
    filename: __filename
}, async (conn, mek, m, { from, args, isCreator, reply }) => {
    if (!isCreator) return reply("*📛 Only the owner can use this command!*");

    if (args[0] === "on") {
      config.ANTI_BAD_WORD = "true";
      reply("✅ Anti-bad words is now enabled.");
    } else if (args[0] === "off") {
      config.ANTI_BAD_WORD = "false";
      reply("❌ Anti-bad words is now disabled.");
    } else {
      reply(`Example: ${prefix}anti-bad on/off`);
    }
});

cmd({
    pattern: "anti-call",
    alias: ["anticallblock"],
    desc: "Enable or disable anti-call",
    category: "settings",
    filename: __filename
}, async (conn, mek, m, { from, args, isCreator, reply }) => {
    if (!isCreator) return reply("*📛 Only the owner can use this command!*");

    if (args[0] === "on") {
      config.ANTI_CALL = "true";
      reply("✅ Anti-call is now enabled.");
    } else if (args[0] === "off") {
      config.ANTI_CALL = "false";
      reply("❌ Anti-call is now disabled.");
    } else {
      reply(`Example: ${prefix}anti-call on/off`);
    }
});

cmd({
    pattern: "anti-call-block",
    alias: ["callblock"],
    desc: "Enable or disable call blocking",
    category: "settings",
    filename: __filename
}, async (conn, mek, m, { from, args, isCreator, reply }) => {
    if (!isCreator) return reply("*📛 Only the owner can use this command!*");

    if (args[0] === "on") {
      config.ANTI_CALL_BLOCK = "true";
      reply("✅ Call blocking is now enabled.");
    } else if (args[0] === "off") {
      config.ANTI_CALL_BLOCK = "false";
      reply("❌ Call blocking is now disabled.");
    } else {
      reply(`Example: ${prefix}anti-call-block on/off`);
    }
});

//---------------------------------------------------------------------------
// GROUP MANAGEMENT COMMANDS
//---------------------------------------------------------------------------

cmd({
    pattern: "antilink",
    alias: ["antilinks"],
    desc: "Enable or disable anti-link",
    category: "group",
    filename: __filename
}, async (conn, mek, m, { isGroup, isAdmins, isBotAdmins, args, reply }) => {
    if (!isGroup) return reply('This command can only be used in a group.');
    if (!isBotAdmins) return reply('Bot must be an admin to use this command.');
    if (!isAdmins) return reply('You must be an admin to use this command.');

    if (args[0] === "on") {
      config.ANTI_LINK = "true";
      reply("✅ Anti-link is now enabled.");
    } else if (args[0] === "off") {
      config.ANTI_LINK = "false";
      reply("❌ Anti-link is now disabled.");
    } else {
      reply(`Example: ${prefix}antilink on/off`);
    }
});

cmd({
    pattern: "antilinkkick",
    alias: ["kicklink"],
    desc: "Enable or disable anti-link kick",
    category: "group",
    filename: __filename
}, async (conn, mek, m, { isGroup, isAdmins, isBotAdmins, args, reply }) => {
    if (!isGroup) return reply('This command can only be used in a group.');
    if (!isBotAdmins) return reply('Bot must be an admin to use this command.');
    if (!isAdmins) return reply('You must be an admin to use this command.');

    if (args[0] === "on") {
      config.ANTI_LINK_KICK = "true";
      reply("✅ Anti-link kick is now enabled.");
    } else if (args[0] === "off") {
      config.ANTI_LINK_KICK = "false";
      reply("❌ Anti-link kick is now disabled.");
    } else {
      reply(`Example: ${prefix}antilinkkick on/off`);
    }
});

cmd({
    pattern: "deletelink",
    alias: ["linksdelete"],
    desc: "Enable or disable link deletion",
    category: "group",
    filename: __filename
}, async (conn, mek, m, { isGroup, isAdmins, isBotAdmins, args, reply }) => {
    if (!isGroup) return reply('This command can only be used in a group.');
    if (!isBotAdmins) return reply('Bot must be an admin to use this command.');
    if (!isAdmins) return reply('You must be an admin to use this command.');

    if (args[0] === "on") {
      config.DELETE_LINKS = "true";
      reply("✅ Link deletion is now enabled.");
    } else if (args[0] === "off") {
      config.DELETE_LINKS = "false";
      reply("❌ Link deletion is now disabled.");
    } else {
      reply(`Example: ${prefix}deletelink on/off`);
    }
});

//---------------------------------------------------------------------------
// STATUS COMMANDS
//---------------------------------------------------------------------------

cmd({
    pattern: "auto-seen",
    alias: ["autoseen"],
    desc: "Enable or disable auto-seen status",
    category: "settings",
    filename: __filename
}, async (conn, mek, m, { from, args, isCreator, reply }) => {
    if (!isCreator) return reply("*📛 Only the owner can use this command!*");

    if (args[0] === "on") {
      config.AUTO_STATUS_SEEN = "true";
      reply("✅ Auto-seen status is now enabled.");
    } else if (args[0] === "off") {
      config.AUTO_STATUS_SEEN = "false";
      reply("❌ Auto-seen status is now disabled.");
    } else {
      reply(`Example: ${prefix}auto-seen on/off`);
    }
});

cmd({
    pattern: "status-react",
    alias: ["statusreact"],
    desc: "Enable or disable status reactions",
    category: "settings",
    filename: __filename
}, async (conn, mek, m, { from, args, isCreator, reply }) => {
    if (!isCreator) return reply("*📛 Only the owner can use this command!*");

    if (args[0] === "on") {
      config.AUTO_STATUS_REACT = "true";
      reply("✅ Status reactions are now enabled.");
    } else if (args[0] === "off") {
      config.AUTO_STATUS_REACT = "false";
      reply("❌ Status reactions are now disabled.");
    } else {
      reply(`Example: ${prefix}status-react on/off`);
    }
});

cmd({
    pattern: "status-reply",
    alias: ["statusreply"],
    desc: "Enable or disable status replies",
    category: "settings",
    filename: __filename
}, async (conn, mek, m, { from, args, isCreator, reply }) => {
    if (!isCreator) return reply("*📛 Only the owner can use this command!*");

    if (args[0] === "on") {
      config.AUTO_STATUS_REPLY = "true";
      reply("✅ Status replies are now enabled.");
    } else if (args[0] === "off") {
      config.AUTO_STATUS_REPLY = "false";
      reply("❌ Status replies are now disabled.");
    } else {
      reply(`Example: ${prefix}status-reply on/off`);
    }
});

//---------------------------------------------------------------------------
// AI COMMANDS
//---------------------------------------------------------------------------

cmd({
    pattern: "chatbot",
    alias: ["aichat"],
    desc: "Enable or disable AI chatbot",
    category: "settings",
    filename: __filename
}, async (conn, mek, m, { from, args, isCreator, reply }) => {
    if (!isCreator) return reply("*📛 Only the owner can use this command!*");

    if (args[0] === "on") {
      config.CHAT_BOT = "true";
      reply("✅ AI chatbot is now enabled.");
    } else if (args[0] === "off") {
      config.CHAT_BOT = "false";
      reply("❌ AI chatbot is now disabled.");
    } else {
      reply(`Example: ${prefix}chatbot on/off`);
    }
});

//---------------------------------------------------------------------------
// MESSAGE PROTECTION COMMANDS
//---------------------------------------------------------------------------

cmd({
    pattern: "anti-delete",
    alias: ["antidel"],
    desc: "Enable or disable anti-delete",
    category: "settings",
    filename: __filename
}, async (conn, mek, m, { from, args, isCreator, reply }) => {
    if (!isCreator) return reply("*📛 Only the owner can use this command!*");

    if (args[0] === "on") {
      config.ANTI_DELETE = "true";
      reply("✅ Anti-delete is now enabled.");
    } else if (args[0] === "off") {
      config.ANTI_DELETE = "false";
      reply("❌ Anti-delete is now disabled.");
    } else {
      reply(`Example: ${prefix}anti-delete on/off`);
    }
});