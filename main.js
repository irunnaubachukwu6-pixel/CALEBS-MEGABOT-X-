import makeWASocket, { DisconnectReason, useMultiFileAuthState } from "@whiskeysockets/baileys";
import P from "pino";
import fs from "fs";
import path from "path";
import figlet from "figlet";
import chalk from "chalk";
import { fileURLToPath } from "url";
import { dirname } from "path";
import config from "./config.js";
import { handleMessage } from "./lib/messageHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.clear();
console.log(chalk.cyan(figlet.textSync(config.botName)));
console.log(chalk.green(`Mode: ${config.mode} | Prefix: ${config.prefix}`));

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("session");
  const sock = makeWASocket({
    printQRInTerminal: true,
    auth: state,
    logger: P({ level: "silent" }),
    browser: ["CALEBS MEGABOT X", "Safari", "1.0.0"],
  });

  // event listener
  sock.ev.on("messages.upsert", async (m) => await handleMessage(sock, m, config));
  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === "close") {
      const reason = lastDisconnect?.error?.output?.statusCode;
      if (reason !== DisconnectReason.loggedOut) startBot();
      else console.log("Logged out from WhatsApp.");
    } else if (connection === "open") {
      console.log(chalk.greenBright("✅ Connected successfully to WhatsApp!"));
    }
  });
}

startBot();
