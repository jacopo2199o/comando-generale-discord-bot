import { Client, GatewayIntentBits } from "discord.js";
import { ready } from "./events/ready.js";
import { roleUpdate } from "./events/guild-member-update.js";
import { execute } from "./events/interaction-create.js";
import dotenv from "dotenv";

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages
  ]
});

client.once("ready", ready);
client.on("interactionCreate", execute);
client.on("guildMemberUpdate", roleUpdate);
client.login(process.env.bot_token);