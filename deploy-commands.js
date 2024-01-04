import {
  REST,
  Routes,
  SlashCommandBuilder
} from "discord.js";
import dotenv from "dotenv";

dotenv.config();

const commands = [];
const rest = new REST().setToken(process.env.bot_token);

commands.push(new SlashCommandBuilder()
  .setName("check-activity")
  .setDescription("check activity to downgrade inactive members"));

commands.push(new SlashCommandBuilder()
  .setName("check-landing")
  .setDescription("check landing for missing or wrong base roles"));

commands.push(new SlashCommandBuilder()
  .setName("about")
  .setDescription("about this channel"));

for (let command of commands) {
  command.toJSON();
}

try {
  const data = await rest.put(Routes.applicationCommands(process.env.client_id), { body: commands });

  console.log(`successfully reloaded ${data.length} application slash commands`);
} catch (error) {
  console.error(error);
}