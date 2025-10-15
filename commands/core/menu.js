const { getGreeting } = require('../../lib/utils');

module.exports = {
    name: 'menu',
    run: async (client, msg) => {
        const text = `
${getGreeting()} 👋
╭─🐉 *CALEBS MEGABOT X* ──
│ Prefix: .
│ Owner: Caleb
│
│ 💡 *Main Commands*
│ • .menu – Show this list
│ • .ping – Check bot speed
│ • .help – Show help guide
│ • .owner – Contact bot owner
│ • .alive – Check bot status
│ • .joke – Get random funny joke
│
│ ⚡ More features loading soon...
╰──────────────────────`;
        await client.sendMessage(msg.key.remoteJid, { text });
    }
};
