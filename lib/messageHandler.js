import fs from "fs";
import path from "path";
import chalk from "chalk";

export async function handleMessage(sock, m, config) {
  try {
    const msg = m.messages[0];
    if (!msg.message) return;

    const from = msg.key.remoteJid;
    const text =
      msg.message.conversation ||
      msg.message.extendedTextMessage?.text ||
      "";

    if (!text.startsWith(config.prefix)) return;

    const cmd = text.slice(config.prefix.length).trim().split(/ +/).shift().toLowerCase();
    const args = text.split(" ").slice(1);

    // Load all plugins dynamically
    const pluginsDir = path.join(process.cwd(), "plugins");
    const categories = fs.readdirSync(pluginsDir);
    for (const cat of categories) {
      const catPath = path.join(pluginsDir, cat);
      const files = fs.readdirSync(catPath).filter((f) => f.endsWith(".js"));
      for (const file of files) {
        const plugin = await import(path.resolve(catPath, file));
        if (plugin.default?.cmd === cmd) {
          return plugin.default.exec(sock, msg, args);
        }
      }
    }
  } catch (e) {
    console.log(chalk.red("[ERROR]"), e);
  }
}
