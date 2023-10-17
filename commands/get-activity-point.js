import { SlashCommandBuilder } from "discord.js";
import { activity } from "./start-activity-points.js";

const cooldown = 4; // modificalo per sbloccare il comando ogni ora
const data = new SlashCommandBuilder()
  .setName("get-activity-point")
  .setDescription("add one point to your activity profile every hour");

/**
 * @param {import("discord.js").Interaction} interaction
 */
const execute = async (interaction) => {
  await interaction.deferReply();

  const added = activity.addPoints(interaction.member, 1);

  if (added === "success") {
    await interaction.editReply(`<@${interaction.member.id}> received 1 activity point`);
  } else {
    await interaction.editReply("activity points are not available: try again later");
  }
};

export {
  cooldown,
  data,
  execute
};
