import fs from "node:fs";
import { SlashCommandBuilder } from "discord.js";
import { start, dayInterval, dayMilliseconds, guild, client, filePath } from "./start-activity-points.js";

const cooldown = 4;
const data = new SlashCommandBuilder()
  .setName("resume-activity-points")
  .setDescription("retrieve activity points and restart monitoring");

/**
 * @param {import("discord.js").Interaction} interaction
*/
const execute = async (interaction) => {
  await interaction.deferReply();

  const resume = (guild, client, membersActivity) => {
    dayInterval.millisecondsRemaining = 0;
    dayInterval.startTime = new Date();
    start(guild, client, membersActivity);
    dayInterval.id = setInterval(start, dayMilliseconds, guild, client, membersActivity);
  };
  
  if (!dayInterval.millisecondsRemaining) {
    await interaction.editReply("monitoring activity is not stopped: nothing to resume");
    return;
  }

  const membersActivity = fs.readFileSync(JSON.parse(filePath));

  setTimeout(resume, dayInterval.millisecondsRemaining, guild, client, membersActivity);

  await interaction.editReply("monitoring activity resumed");
};

export {
  cooldown,
  data,
  execute
};