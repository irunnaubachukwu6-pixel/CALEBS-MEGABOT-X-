const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, makeInMemoryStore, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const P = require('pino');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { log } = require('./utils');
const { loadSession } = require('./session/sessionManager');

const startBot = async () => {
    const { state, saveCreds } = await loadSession();
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        logger: P({ level: 'silent' }),
        printQRInTerminal: false, // disable QR (we’ll use pairing)
        auth: state,
        browser: ["CALEBS MEGABOT X 🐉", "Chrome", "6.0"],
        markOnlineOnConnect: true
    });

    // 🔹 Handle pairing code login
    if (!sock.authState.creds.registered) {
        log('info', 'Generating pairing code...');
        const phoneNumber = await askUser("📱 Enter your WhatsApp number (with country code, e.g. 234XXXXXXXXXX): ");
        const code = await sock.requestPairingCode(phoneNumber);
        console.log(`✅ Your WhatsApp Pairing Code: ${code}`);
        console.log("⚠️ Open WhatsApp > Linked Devices > Link Device > Enter Code Above\n");
    }

    // 🔹 Event listeners
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;

        if (connection === 'open') {
            log('success', '✅ Connected to WhatsApp!');
        } else if (connection === 'close') {
            const reason = lastDisconnect?.error?.output?.statusCode;
            log('error', `Connection closed. Reason: ${reason}`);
            if (reason === DisconnectReason.loggedOut) {
                log('warn', 'Session expired. Delete session folder and reconnect.');
            } else {
                startBot();
            }
        }
    });

    // 🔹 Save credentials automatically
    sock.ev.on('creds.update', saveCreds);

    return sock;
};

// 📟 Simple prompt input
function askUser(promptText) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise((resolve) => {
        rl.question(promptText, (answer) => {
            rl.close();
            resolve(answer.trim());
        });
    });
}

module.exports = startBot;
