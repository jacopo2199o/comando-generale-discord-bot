import { Client, GatewayIntentBits } from "discord.js";
import { activityDone } from "./events/activity.js";
import { interactionCreate } from "./events/interaction-create.js";
import { inviteCreate } from "./events/invite-create.js";
import { guildMemberAdd } from "./events/guild-member-add.js";
import { guildMemberRemove } from "./events/guild-member-remove.js";
import { guildMemberUpdate } from "./events/guild-member-update.js";
import { messageCreate } from "./events/message-create.js";
import { ready } from "./events/ready.js";
import { threadCreate } from "./events/thread-create.js";
import dotenv from "dotenv";

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages
  ]
});

client.once("ready", ready);
client.on("activity", activityDone);
client.on("interactionCreate", interactionCreate);
client.on("inviteCreate", inviteCreate);
client.on("guildMemberAdd", guildMemberAdd);
client.on("guildMemberRemove", guildMemberRemove);
client.on("guildMemberUpdate", guildMemberUpdate);
client.on("threadCreate", threadCreate);
client.on("messageCreate", messageCreate);
client.login(process.env.bot_token);