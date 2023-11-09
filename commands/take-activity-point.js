import { SlashCommandBuilder } from "discord.js";
import { communities } from "../events/ready.js";

const cooldown = 10; // modificalo per sbloccare il comando ogni ora
const data = new SlashCommandBuilder()
  .setName("take-activity-point")
  .setDescription("take activity point for ranking up");

/**
 * @param {import("discord.js").Interaction} interaction
 */
const execute = async (interaction) => {
  await interaction.deferReply();
  
  /**
   * @type { import("../community.js").Community }
  */
  const community = communities.get(interaction.guildId);
  const isTaken = community.activity.takePoint(interaction.member, 1);

  if (isTaken === "not running") {
    await interaction.editReply("activity points is not started: try again later");
  } else if (isTaken === "administrator") {
    await interaction.editReply("administrators are excluded");
  } else if (isTaken === "not found") {
    await interaction.editReply("something went wrong");
  } else {
    await interaction.editReply(`<@${interaction.member.id}> received 1 activity point`);
  }
};

export {
  cooldown,
  data,
  execute
};
