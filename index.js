import { Client, GatewayIntentBits } from "discord.js";
import { ready } from "./events/ready.js";
import { guildMemberUpdate } from "./events/guild-member-update.js";
import { threadCreate } from "./events/thread-create.js";
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
client.on("guildMemberUpdate", guildMemberUpdate);
client.on("threadCreate", threadCreate);
client.login(process.env.bot_token);