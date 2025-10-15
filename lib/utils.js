const fs = require('fs');
const moment = require('moment-timezone');

// ✅ Format time to human readable
const formatTime = (timestamp) => {
    return moment(timestamp).tz('Africa/Lagos').format('DD/MM/YYYY HH:mm:ss');
};

// ✅ Pick random item from an array
const randomPick = (array) => array[Math.floor(Math.random() * array.length)];

// ✅ Simple logger
const log = (type, message) => {
    const time = formatTime(Date.now());
    console.log(`[${time}] [${type.toUpperCase()}] ${message}`);
};

// ✅ Check if file exists
const fileExists = (path) => fs.existsSync(path);

// ✅ Read JSON file safely
const readJSON = (path) => {
    try {
        if (fs.existsSync(path)) {
            return JSON.parse(fs.readFileSync(path, 'utf8'));
        } else {
            return {};
        }
    } catch (err) {
        log('error', `Failed to read JSON file: ${err.message}`);
        return {};
    }
};

// ✅ Write JSON safely
const writeJSON = (path, data) => {
    try {
        fs.writeFileSync(path, JSON.stringify(data, null, 2));
        log('info', `Updated ${path} successfully`);
    } catch (err) {
        log('error', `Failed to write JSON file: ${err.message}`);
    }
};

// ✅ Sleep (delay)
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ✅ Get greeting (Morning, Afternoon, Night)
const getGreeting = () => {
    const hour = moment().tz('Africa/Lagos').hour();
    if (hour < 12) return '🌞 Good Morning';
    if (hour < 18) return '🌤️ Good Afternoon';
    return '🌙 Good Evening';
};

// ✅ Convert bytes to readable size
const bytesToSize = (bytes) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
};

// ✅ Export all utils
module.exports = {
    formatTime,
    randomPick,
    log,
    fileExists,
    readJSON,
    writeJSON,
    sleep,
    getGreeting,
    bytesToSize
};
