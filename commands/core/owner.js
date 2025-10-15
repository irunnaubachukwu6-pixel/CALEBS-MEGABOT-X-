module.exports = {
    name: 'owner',
    run: async (client, msg) => {
        const owner = 'Caleb (Developer of CALEBS MEGABOT X 🐉)';
        const contact = 'wa.me/2347079799769';
        const text = `👑 *Bot Owner Info*\n────────────────\nName: ${owner}\nWhatsApp: ${contact}\n────────────────\n💬 Message him for bot collaborations or updates.`;
        await client.sendMessage(msg.key.remoteJid, { text });
    }
};
