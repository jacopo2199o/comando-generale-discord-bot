import { Client, GatewayIntentBits } from "discord.js";
import { ready } from "./events/ready.js";
import { inviteCreate } from "./events/invite-create.js";
import { guildMemberAdd } from "./events/guild-member-add.js";
import { guildMemberUpdate } from "./events/guild-member-update.js";
import { threadCreate } from "./events/thread-create.js";
import { execute } from "./events/interaction-create.js";
import dotenv from "dotenv";
import fs from "fs";

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
client.on("interactionCreate", execute);
client.on("inviteCreate", inviteCreate);
client.on("guildMemberAdd", guildMemberAdd);
client.on("guildMemberUpdate", guildMemberUpdate);
client.on("threadCreate", threadCreate);
client.login(process.env.bot_token);


const myObject = { name: "jacopo" };
fs.writeFileSync("./resources/test.json", JSON.stringify(myObject));

const readedObject = fs.readFileSync("./resources/test.json");
console.log(JSON.parse(readedObject));

