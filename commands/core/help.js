module.exports = {
    name: 'help',
    run: async (client, msg) => {
        const text = `
📖 *CALEBS MEGABOT X HELP MENU*
──────────────────────────────
Type any of these commands with a dot (.) prefix:

• .menu – View main command list  
• .ping – Check connection speed  
• .alive – Check if bot is running  
• .owner – Get owner contact info  
• .joke – Random funny message  

More command packs coming soon:  
🛠 Tools | 🎮 Games | 🎭 Entertainment | 📚 Education
──────────────────────────────`;
        await client.sendMessage(msg.key.remoteJid, { text });
    }
};
