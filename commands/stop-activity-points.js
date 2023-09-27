import fs from "node:fs";
import { SlashCommandBuilder } from "discord.js";
import { dayInterval, membersActivity, filePath } from "./start-activity-points.js";

const cooldown = 4;
const data = new SlashCommandBuilder()
  .setName("stop-activity-points")
  .setDescription("save activity points and stop monitoring");

/**
 * @param {import("discord.js").Interaction} interaction
*/
const execute = async (interaction) => {
  await interaction.deferReply();

  if (!dayInterval.id) {
    await interaction.editReply("activity points is not started: nothing to stop");
    return;
  }
  dayInterval.millisecondsRemaining = (new Date() - dayInterval.startTime);
  clearTimeout(dayInterval.id);

  fs.writeFileSync(filePath, JSON.stringify(membersActivity, null, 2));

  await interaction.editReply(`activity points saved: stop monitoring. ms remaining: ${dayInterval.millisecondsRemaining}`);
};

export {
  cooldown,
  data,
  execute
};