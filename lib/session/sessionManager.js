const { useMultiFileAuthState } = require('@whiskeysockets/baileys');
const path = require('path');
const fs = require('fs');
const { log } = require('./../utils');

const SESSION_FOLDER = path.join(__dirname, './auth_info');

/**
 * Initializes and manages Baileys authentication state.
 */
async function loadSession() {
    // Ensure folder exists
    if (!fs.existsSync(SESSION_FOLDER)) {
        fs.mkdirSync(SESSION_FOLDER, { recursive: true });
        log('info', 'Session folder created ✅');
    }

    // Load existing session or create new one
    const { state, saveCreds } = await useMultiFileAuthState(SESSION_FOLDER);
    log('info', 'Session loaded successfully ⚡');
    return { state, saveCreds };
}

/**
 * Deletes old session files (if needed)
 */
function clearSession() {
    if (fs.existsSync(SESSION_FOLDER)) {
        fs.rmSync(SESSION_FOLDER, { recursive: true, force: true });
        log('warn', 'Old session cleared 🧹');
    } else {
        log('warn', 'No session found to clear.');
    }
}

module.exports = {
    loadSession,
    clearSession,
    SESSION_FOLDER
};
