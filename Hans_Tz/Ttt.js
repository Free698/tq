const { cmd } = require('../command');
const activeGames = {};

cmd({
  pattern: "ttt",
  alias: ["tictactoe", "xo"],
  desc: "Start a Tic Tac Toe game",
  category: "game",
  filename: __filename,
}, async (conn, mek, m, { from, sender, reply }) => {
  if (activeGames[from]) return reply("🎮 A game is already running in this chat.");

  const playerX = sender;
  const game = {
    board: ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"],
    playerX,
    playerO: null,
    currentTurn: "X",
    active: true,
    timeout: null,
    handler: null,
  };

  const drawBoard = () => {
    const b = game.board;
    return `\n${b[0]} ${b[1]} ${b[2]}\n${b[3]} ${b[4]} ${b[5]}\n${b[6]} ${b[7]} ${b[8]}`;
  };

  const winCheck = (b, s) => {
    const winPatterns = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]
    ];
    return winPatterns.some(([a,b1,c]) => b[a] === s && b[b1] === s && b[c] === s);
  };

  const cleanup = () => {
    clearTimeout(game.timeout);
    conn.ev.off("messages.upsert", game.handler);
    delete activeGames[from];
  };

  await conn.sendMessage(from, {
    text: `🎮 *Tic Tac Toe Started!*\n\nHi 👋 @${playerX.split("@")[0]} started a game!\nType *join* to join and start playing.`,
    mentions: [playerX]
  }, { quoted: m });

  game.timeout = setTimeout(() => {
    if (activeGames[from]) {
      cleanup();
      conn.sendMessage(from, { text: "⏰ Game ended due to inactivity." });
    }
  }, 5 * 60 * 1000);

  const extractText = (msg) =>
    msg.message?.conversation ||
    msg.message?.extendedTextMessage?.text ||
    msg.message?.imageMessage?.caption ||
    msg.message?.videoMessage?.caption ||
    "";

  game.handler = async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message || !activeGames[from]) return;

    const text = extractText(msg).trim();
    const fromUser = msg.key.participant || msg.key.remoteJid;

    // Handle join
    if (!game.playerO && /^join$/i.test(text) && fromUser !== game.playerX) {
      game.playerO = fromUser;
      game.currentTurn = "X";

      await conn.sendMessage(from, {
        text: `🎮 *Player 2 @${fromUser.split("@")[0]} joined the game!*\n\nGame between:\n❌ @${game.playerX.split("@")[0]}\n⭕ @${game.playerO.split("@")[0]}\n\nHi 👋 @${game.playerX.split("@")[0]} it's your turn! You are ❌\n${drawBoard()}\n\n_Reply with a number (1-9) to play your move._`,
        mentions: [game.playerX, game.playerO]
      }, { quoted: msg });
      return;
    }

    // Game not ready
    if (!game.playerO || !game.active) return;

    const move = parseInt(text);
    if (isNaN(move) || move < 1 || move > 9) return;

    const isX = game.currentTurn === "X";
    const expectedPlayer = isX ? game.playerX : game.playerO;
    if (fromUser !== expectedPlayer) {
      return conn.sendMessage(from, {
        text: `⛔ Not your turn! It's @${expectedPlayer.split("@")[0]}'s turn.`,
        mentions: [expectedPlayer]
      }, { quoted: msg });
    }

    const index = move - 1;
    if (["❌", "⭕"].includes(game.board[index])) {
      return conn.sendMessage(from, {
        text: "⚠️ That spot is already taken."
      }, { quoted: msg });
    }

    const symbol = isX ? "❌" : "⭕";
    game.board[index] = symbol;

    // Win
    if (winCheck(game.board, symbol)) {
      await conn.sendMessage(from, {
        text: `🎉 *Game Over!*\n\n@${fromUser.split("@")[0]} (${symbol}) wins!\n───────────────\n${drawBoard()}\n───────────────`,
        mentions: [fromUser]
      });
      cleanup();
      return;
    }

    // Draw
    if (!game.board.some(cell => !["❌", "⭕"].includes(cell))) {
      await conn.sendMessage(from, {
        text: `🤝 *It's a draw!*\n───────────────\n${drawBoard()}\n───────────────`
      });
      cleanup();
      return;
    }

    // Next turn
    game.currentTurn = isX ? "O" : "X";
    const nextPlayer = game.currentTurn === "X" ? game.playerX : game.playerO;

    await conn.sendMessage(from, {
      text: `Hi 👋 @${nextPlayer.split("@")[0]} it's your turn! You are ${game.currentTurn === "X" ? "❌" : "⭕"}\n${drawBoard()}\n\n_Reply with a number (1-9) to play your move._`,
      mentions: [nextPlayer]
    }, { quoted: msg });
  };

  conn.ev.on("messages.upsert", game.handler);
  activeGames[from] = game;
});

cmd({
  pattern: "delttt",
  desc: "Stop running Tic Tac Toe game",
  category: "game",
  filename: __filename,
}, async (conn, mek, m, { from, reply }) => {
  if (!activeGames[from]) return reply("🚫 No active Tic Tac Toe game in this chat.");
  clearTimeout(activeGames[from].timeout);
  conn.ev.off("messages.upsert", activeGames[from].handler);
  delete activeGames[from];
  reply("✅ Game ended.");
});