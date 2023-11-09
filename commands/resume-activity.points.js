import { SlashCommandBuilder } from "discord.js";
import { communities } from "../events/ready.js";

const cooldown = 1;
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
  const isResumed = community.activity.resume(interaction.client);

  if (isResumed === "running") {
    await interaction.editReply("activity points already started: use /stop activity");
  } else {
    await interaction.editReply("resume monitoring");
  }
};

export {
  cooldown,
  data,
  execute
};