import { SlashCommandBuilder } from "discord.js";
import { activity } from "./start-activity-points.js";

const cooldown = 4;
const data = new SlashCommandBuilder()
  .setName("stop-activity-points")
  .setDescription("save activity points and stop monitoring");

/**
 * @param {import("discord.js").Interaction} interaction
*/
const execute = async (interaction) => {
  await interaction.deferReply();

  const stopped = activity.stop();
  
  if (stopped === "not started") {
    await interaction.editReply("activity points is not started: nothing to stop");
  }

  await interaction.editReply("activity points saved: stop monitoring");
};

export {
  cooldown,
  data,
  execute
};