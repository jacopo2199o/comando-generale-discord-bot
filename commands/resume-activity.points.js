import fs from "node:fs";
import { SlashCommandBuilder } from "discord.js";
import { community } from "../events/ready.js";
import {
  start,
  dayInterval,
  activityPointsFilePath,
} from "./start-activity-points.js";

const cooldown = 4;
const data = new SlashCommandBuilder()
  .setName("resume-activity-points")
  .setDescription("retrieve activity points and restart monitoring");

/**
 * @param {import("discord.js").Interaction} interaction
*/
const execute = async (interaction) => {
  await interaction.deferReply();

  let activityPoints = JSON.parse(fs.readFileSync(activityPointsFilePath));
  const guild = interaction.client.guilds.resolve(community.id);
  const client = interaction.client;
  
  if (dayInterval.id) {
    await interaction.editReply("monitoring activity is not stopped: nothing to resume");
    return;
  }

  dayInterval.millisecondsRemaining = null;
  dayInterval.millisecondsStartTime = new Date();
  setTimeout(() => {
    start(guild, client, community.ranks, activityPoints);
    dayInterval.id = setInterval(start, dayInterval.millisecondsDuration, guild, client, community.ranks, activityPoints);
  }, dayInterval.millisecondsRemaining);

  await interaction.editReply("activity points resumed: monitoring...");
};

export {
  cooldown,
  data,
  execute
};