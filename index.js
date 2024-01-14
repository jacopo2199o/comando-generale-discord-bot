import { Client, GatewayIntentBits } from "discord.js";
import { activity } from "./events/activity.js";
import { interactionCreate } from "./events/interaction-create.js";
import { inviteCreate } from "./events/invite-create.js";
import { guildMemberAdd } from "./events/guild-member-add.js";
import { guildMemberRemove } from "./events/guild-member-remove.js";
import { guildMemberUpdate } from "./events/guild-member-update.js";
import { messageCreate } from "./events/message-create.js";
import { messageDelete } from "./events/message-delete.js";
import { messageReactionAdd } from "./events/message-reaction-add.js";
import { ready } from "./events/ready.js";
import { threadCreate } from "./events/thread-create.js";
import dotenv from "dotenv";

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions
  ]
});

client.once("ready", ready);
client.on("activity", activity);
client.on("interactionCreate", interactionCreate);
client.on("inviteCreate", inviteCreate);
client.on("guildMemberAdd", guildMemberAdd);
client.on("guildMemberRemove", guildMemberRemove);
client.on("guildMemberUpdate", guildMemberUpdate);
client.on("messageCreate", messageCreate);
client.on("messageDelete", messageDelete);
client.on("messageReactionAdd", messageReactionAdd);
client.on("threadCreate", threadCreate);
client.login(process.env.bot_token);
