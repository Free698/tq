const config = require('../config');

module.exports = (conn) => {
    conn.ws.on('CB:call', async (json) => {
        if (config.ANTICALL !== 'true') return;

        const callerId = json.content[0]?.attrs?.from;
        const callType = json.content[0]?.tag;

        if (callType === 'offer' && callerId) {
            console.log(`[⚠️] Incoming call from ${callerId}`);

            try {
                // Send a warning message
                await conn.sendMessage(callerId, {
                    text: `🚫 *Calling the bot is not allowed!*\n\nPlease avoid calling the bot or you may get ignored.`,
                });

                // Try to reject the call (if supported)
                if (conn.rejectCall) {
                    await conn.rejectCall(callerId);
                }

            } catch (err) {
                console.error('[❌] Failed to handle incoming call:', err);
            }
        }
    });
};