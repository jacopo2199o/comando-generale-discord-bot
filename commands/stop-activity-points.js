import { SlashCommandBuilder } from "discord.js";
import {
  dayInterval,
  activityPoints,
  activityPointsFilePath
} from "./start-activity-points.js";
import { saveFile } from "../general-utilities.js";

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

  dayInterval.millisecondsRemaining = new Date() - dayInterval.millisecondsStartTime;
  dayInterval.id = clearInterval(dayInterval.id);

  saveFile(activityPoints, activityPointsFilePath);

  await interaction.editReply("activity points saved: stop monitoring");
};

export {
  cooldown,
  data,
  execute
};