const config = require('../config'); // Make sure this path is correct

// === ANTICALL FEATURE ===
if (config.ANTICALL === 'true') {
  conn.ws.on('CB:call', async (json) => {
    const callerId = json.content?.[0]?.attrs?.from;
    const callType = json.content?.[0]?.tag;

    if (callType === 'offer' && callerId) {
      console.log(`[📞] Incoming call from: ${callerId}`);

      try {
        // Send a warning message to the caller
        await conn.sendMessage(callerId, {
          text: `🚫 *Calling the bot is not allowed!*\n\nPlease avoid calling this number. Your messages may be ignored if you continue.`,
        });

        // Reject the call (if supported by your library)
        if (typeof conn.rejectCall === 'function') {
          await conn.rejectCall(callerId);
        }

      } catch (err) {
        console.error('❌ Error handling incoming call:', err);
      }
    }
  });
}