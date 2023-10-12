import { SlashCommandBuilder } from "discord.js";
import dotenv from "dotenv";
import { community } from "../events/ready.js";
import { Activity } from "../activity.js";

dotenv.config();

const activity = new Activity();
const cooldown = 4;
const data = new SlashCommandBuilder()
  .setName("start-activity-points")
  .setDescription("set initial activity points and start monitoring");

/**
 * @param {import("discord.js").Interaction} interaction
*/
const execute = async (interaction) => {
  await interaction.deferReply();

  await activity.initialize(community, interaction.client);
  activity.start(community, interaction.client);

  await interaction.editReply("activity points created: start monitoring...");
};

export {
  activity,
  cooldown,
  data,
  execute
};
