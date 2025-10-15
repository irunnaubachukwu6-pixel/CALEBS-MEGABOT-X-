module.exports = {
    name: 'ping',
    run: async (client, msg) => {
        const start = Date.now();
        const from = msg.key.remoteJid;
        const sent = await client.sendMessage(from, { text: '🏓 Pinging...' });
        const end = Date.now();
        const speed = end - start;
        await client.sendMessage(from, { text: `⚡ Pong! Response time: *${speed}ms*` });
    }
};
