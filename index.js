import {
  Client,
  Collection,
  GatewayIntentBits
} from "discord.js";
import { execute } from "./events/ready.js";

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

  client.once("ready", execute);
  //client.on(event.name, (...args) => event.execute(...args));

  client.login(process.env.bot_token);
})();