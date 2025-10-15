/**
 * ============================================
 * 🐉 CALEBS MEGABOT X - MAIN STARTUP FILE
 * Powerful • Professional • Funny • Fast ⚡
 * ============================================
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const startBot = require('./lib/baileysConnect');
const { log, getGreeting } = require('./lib/utils');

// ===========================
// 🌍 GLOBAL CONFIG
// ===========================
global.botName = 'CALEBS MEGABOT X 🐉';
global.ownerName = 'Caleb';
global.prefix = '.';
global.commands = new Map(); // stores command functions

// ===========================
// 📦 LOAD COMMANDS
// ===========================
function loadCommands() {
    const commandsPath = path.join(__dirname, 'commands');
    if (!fs.existsSync(commandsPath)) fs.mkdirSync(commandsPath);

    const categories = fs.readdirSync(commandsPath);
    for (const category of categories) {
        const categoryPath = path.join(commandsPath, category);
        if (fs.lstatSync(categoryPath).isDirectory()) {
            const files = fs.readdirSync(categoryPath).filter(f => f.endsWith('.js'));
            for (const file of files) {
                const command = require(path.join(categoryPath, file));
                if (command.name && typeof command.run === 'function') {
                    global.commands.set(command.name, command);
                }
            }
        }
    }

    log('info', `Loaded ${global.commands.size} commands successfully ✅`);
}

// ===========================
// 🚀 START BOT
// ===========================
(async () => {
    console.clear();
    console.log(chalk.cyan.bold(`\n🐉 WELCOME TO ${global.botName}`));
    console.log(chalk.greenBright(`${getGreeting()}, ${global.ownerName}!\n`));
    console.log(chalk.yellow('Initializing connection... Please wait...\n'));

    loadCommands();

    const client = await startBot();

    // ===========================
    // 💬 MESSAGE HANDLER
    // ===========================
    client.ev.on('messages.upsert', async ({ messages }) => {
        try {
            const msg = messages[0];
            if (!msg.message) return;

            const from = msg.key.remoteJid;
            const isGroup = from.endsWith('@g.us');
            const body = msg.message.conversation || msg.message.extendedTextMessage?.text || '';
            const sender = msg.key.participant || msg.key.remoteJid;
            const isCmd = body.startsWith(global.prefix);

            if (!isCmd) return;
            const args = body.slice(global.prefix.length).trim().split(/ +/);
            const commandName = args.shift().toLowerCase();

            const command = global.commands.get(commandName);
            if (command) {
                log('cmd', `Command used: ${commandName} by ${sender}`);
                await command.run(client, msg, args, { from, isGroup, sender });
            } else {
                await client.sendMessage(from, { text: `❌ Unknown command: *${commandName}*` });
            }
        } catch (err) {
            log('error', err.message);
        }
    });
})();
