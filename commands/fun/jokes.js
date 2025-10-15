module.exports = {
    name: 'joke',
    run: async (client, msg) => {
        const jokes = [
            "😂 Why don’t skeletons fight each other? They don’t have the guts!",
            "🤣 My code’s so perfect, even bugs take notes.",
            "😆 I told my WiFi we’re done — there’s just no connection anymore.",
            "🤖 Bot: I would tell you a UDP joke, but you might not get it."
        ];
        const random = jokes[Math.floor(Math.random() * jokes.length)];
        await client.sendMessage(msg.key.remoteJid, { text: random });
    }
};
