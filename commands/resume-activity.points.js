import { SlashCommandBuilder } from "discord.js";
import { activity } from "./start-activity-points.js";
import { community } from "../events/ready.js";

const cooldown = 4;
const data = new SlashCommandBuilder()
  .setName("resume-activity-points")
  .setDescription("retrieve activity points and restart monitoring");

/**
 * @param {import("discord.js").Interaction} interaction
*/
const execute = async (interaction) => {
  await interaction.deferReply();

  const resumed = activity.resume(community, interaction.client);

  if (resumed === "not stopped") {
    await interaction.editReply("monitoring activity is not stopped: nothing to resume");
    return;
  }

  await interaction.editReply("activity points resumed: monitoring...");
};

export {
  cooldown,
  data,
  execute
};