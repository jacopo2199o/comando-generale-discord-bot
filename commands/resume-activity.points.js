import fs from "node:fs";
import { SlashCommandBuilder } from "discord.js";
import { community } from "../events/ready.js";
import {
  activity,
  dayInterval,
  start,
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

  const client = interaction.client;
  const guild = interaction.client.guilds.resolve(community.id);

  activity.points = JSON.parse(fs.readFileSync(activity.filePath));
  
  if (dayInterval.id) {
    await interaction.editReply("monitoring activity is not stopped: nothing to resume");
    return;
  }

  dayInterval.millisecondsRemaining = null;
  dayInterval.millisecondsStartTime = new Date();
  setTimeout(() => {
    start(guild, client, community, activity);
    dayInterval.id = setInterval(start, dayInterval.millisecondsDuration, guild, client, community, activity);
  }, dayInterval.millisecondsRemaining);

  await interaction.editReply("activity points resumed: monitoring...");
};

export {
  cooldown,
  data,
  execute
};