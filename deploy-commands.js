import {
  REST,
  Routes,
  SlashCommandBuilder
} from "discord.js";
import dotenv from "dotenv";

dotenv.config();

const rest = new REST().setToken(process.env.bot_token);
const commands = [];

// const about = new SlashCommandBuilder();
// const clear = new SlashCommandBuilder();
// const clear = new SlashCommandBuilder();
// const clear = new SlashCommandBuilder();
// const clear = new SlashCommandBuilder();
// const clear = new SlashCommandBuilder();
// const clear = new SlashCommandBuilder();
// const clear = new SlashCommandBuilder();

commands.push(new SlashCommandBuilder()
  .setName("about")
  .setDescription("about this channel"));

commands.push(new SlashCommandBuilder()
  .setName("clear")
  .setDescription("clear channel from last 100 messages"));

commands.push(new SlashCommandBuilder()
  .setName("downgrade")
  .setDescription("downgrade one rank all members"));

commands.push(new SlashCommandBuilder()
  .setName("chart-promotion-points")
  .setDescription("chart promotion point top 10 members"));

commands.push(new SlashCommandBuilder()
  .setName("check-landing")
  .setDescription("check landing for missing or wrong base roles"));

commands.push(new SlashCommandBuilder()
  .setName("give-reputation-point")
  .setDescription("give reputation point to a member")
  .addUserOption((option) => option
    .setName("member")
    .setDescription("member to give point")
    .setRequired(true)
  ));

commands.push(new SlashCommandBuilder()
  .setName("save")
  .setDescription("save points into database"));

commands.push(new SlashCommandBuilder()
  .setName("view-promotion-points")
  .setDescription("view points to next rank")
  .addUserOption((option) => option
    .setName("member")
    .setDescription("member points")
    .setRequired(false)
  ));

commands.push(new SlashCommandBuilder()
  .setName("view-reputation-points")
  .setDescription("view reputation points of a member")
  .addUserOption((option) => option
    .setName("member")
    .setDescription("member reputation points")
    .setRequired(false)
  ));

for (const command of commands) { command.toJSON(); }

try {
  const data = await rest.put(Routes.applicationCommands(process.env.client_id), { body: commands });

  console.log(`successfully reloaded ${data.length} application slash commands`);
} catch (error) { console.error(error); }