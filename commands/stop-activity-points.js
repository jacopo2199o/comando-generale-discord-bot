import { SlashCommandBuilder } from "discord.js";
import { communities } from "../events/ready.js";

const cooldown = 4;
const data = new SlashCommandBuilder()
  .setName("stop-activity-points")
  .setDescription("stop activity points and saving");

/**
 * @param {import("discord.js").Interaction} interaction
*/

const execute = async (interaction) => {
  await interaction.deferReply();
  
  /**
   * @type { import("../community.js").Community }
   */
  const community = communities.get(interaction.guildId);
  const stopped = await community.activity.stop();

  if (stopped === "not running") {
    await interaction.editReply("activity points not started: use /start-activity");
  } else {
    await interaction.editReply("stop monitoring");
  }
};

export {
  cooldown,
  data,
  execute
};