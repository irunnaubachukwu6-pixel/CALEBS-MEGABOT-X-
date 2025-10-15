import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
} from "@whiskeysockets/baileys";
import P from "pino";
import chalk from "chalk";

/**
 * Connects to WhatsApp using Baileys Multi-Device.
 * Handles reconnections and saves credentials in the /session folder.
 */
export async function connectToWhatsApp(startBotCallback) {
  try {
    console.log(chalk.cyan("\n🚀 Starting CALEBS MEGABOT X WhatsApp Connection...\n"));

    const { state, saveCreds } = await useMultiFileAuthState("session");
    const sock = makeWASocket({
      printQRInTerminal: true,
      auth: state,
      logger: P({ level: "silent" }),
      browser: ["CALEBS MEGABOT X 🐉", "Safari", "1.0.0"],
    });

    // Connection status updates
    sock.ev.on("connection.update", async (update) => {
      const { connection, lastDisconnect } = update;

      if (connection === "connecting") {
        console.log(chalk.yellow("🟡 Connecting to WhatsApp..."));
      } else if (connection === "open") {
        console.log(chalk.greenBright("✅ Connected successfully to WhatsApp!"));
      } else if (connection === "close") {
        const reason = lastDisconnect?.error?.output?.statusCode;
        console.log(chalk.red(`❌ Connection closed. Reason: ${reason || "Unknown"}`));

        // Auto-reconnect unless logged out
        if (reason !== DisconnectReason.loggedOut) {
          console.log(chalk.yellow("🔄 Reconnecting..."));
          await connectToWhatsApp(startBotCallback);
        } else {
          console.log(chalk.red("⚠️ Logged out from WhatsApp. Delete /session and restart."));
        }
      }
    });

    // Save credentials whenever they update
    sock.ev.on("creds.update", saveCreds);

    // Once connected, trigger main bot logic
    if (typeof startBotCallback === "function") {
      startBotCallback(sock);
    }

    return sock;
  } catch (err) {
    console.error(chalk.red("💀 Error in baileysConnect.js:"), err);
  }
}
