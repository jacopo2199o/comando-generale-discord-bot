import fs from "node:fs";
import path from "node:path";
import {
  fileURLToPath,
  pathToFileURL
} from "node:url";
import dotenv from "dotenv";
import {
  Client,
  Collection,
  GatewayIntentBits
} from "discord.js";

dotenv.config();

const bot = (() => {
  const paths = ((commands, events) => {
    const baseName = (() => {
      const basePath = fileURLToPath(import.meta.url);
      return path.dirname(basePath);
    })();
    return Object.freeze({
      commands: path.join(baseName, commands),
      events: path.join(baseName, events)
    });
  })("commands", "events");
  return Object.freeze({
    commands: {
      files: fs.readdirSync(paths.commands)
        .filter(file => file.endsWith(".js")),
      path: paths.commands
    },
    events: {
      files: fs.readdirSync(paths.events)
        .filter(file => file.endsWith(".js")),
      path: paths.events
    }
  });
})();

(async () => {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildMessages
    ]
  });
  client.commands = new Collection();
  client.cooldowns = new Collection();

  for (const file of bot.commands.files) {
    const command = await (() => {
      const fileURL = (() => {
        const filePath = path.join(bot.commands.path, file);
        return pathToFileURL(filePath);
      })();
      return import(fileURL);
    })();

    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.error(`[warning] the command ad ${bot.commands.path} is missing required "data" or "execute" property`);
    }
  }

  for (const file of bot.events.files) {
    const event = await (() => {
      const fileURL = (() => {
        const filePath = path.join(bot.events.path, file);
        return pathToFileURL(filePath);
      })();
      return import(fileURL);
    })();

    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args));
    } else {
      client.on(event.name, (...args) => event.execute(...args));
    }
  }

  client.login(process.env.bot_token);
})();