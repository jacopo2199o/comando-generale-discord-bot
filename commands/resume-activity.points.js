import { SlashCommandBuilder } from "discord.js";
import { communities } from "../events/ready.js";

const cooldown = 4;
const data = new SlashCommandBuilder()
  .setName("resume-activity-points")
  .setDescription("resume activity points and restart monitoring");

/**
 * @param {import("discord.js").Interaction} interaction
*/
const execute = async (interaction) => {
  await interaction.deferReply();

  /**
 * @type { import("../community.js").Community }
 */
  const community = communities.get(interaction.guildId);
  const resumed = community.activity.resume(interaction.client);

  if (resumed === "running") {
    await interaction.editReply("activity points already started: stop activity first");
  } else {
    await interaction.editReply("activity points resumed: monitoring...");
  }
};

export {
  cooldown,
  data,
  execute
};