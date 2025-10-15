const { getGreeting } = require('../../lib/utils');

module.exports = {
    name: 'alive',
    run: async (client, msg) => {
        const text = `
${getGreeting()} 🌞
I'm *CALEBS MEGABOT X 🐉* and I'm fully operational!

💫 Version: 1.0.0
💻 Platform: Baileys-MD
👑 Developer: Caleb
⚙️ Status: Online ✅

Type *.menu* to view all available commands.
`;
        await client.sendMessage(msg.key.remoteJid, { text });
    }
};
