import fs from "node:fs";
import { SlashCommandBuilder } from "discord.js";
import { serverId } from "../index.js";
import {
  start,
  dayInterval,
  activityPointsPath,
  //membersActivity,
  rolesTable
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

  let membersActivity = JSON.parse(fs.readFileSync(activityPointsPath));
  const guild = interaction.client.guilds.resolve(serverId);
  const client = interaction.client;
  
  if (dayInterval.id) {
    await interaction.editReply("monitoring activity is not stopped: nothing to resume");
    return;
  }

  dayInterval.millisecondsRemaining = null;
  dayInterval.millisecondsStartTime = new Date();
  setTimeout(() => {
    start(guild, client, rolesTable, membersActivity);
    dayInterval.id = setInterval(start, dayInterval.millisecondInterval, guild, client, rolesTable, membersActivity);
  }, dayInterval.millisecondsRemaining);

  await interaction.editReply("activity points resumed: monitoring...");
};

export {
  cooldown,
  data,
  execute
};