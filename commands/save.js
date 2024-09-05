import { globalPoints, reputationPoints, seniority } from "../events/ready.js";
import { saveFile } from "../resources/general-utilities.js";

/** 
 * @param {import("discord.js").Interaction} interaction 
 */
const save = async (interaction) =>
{
  await interaction.deferReply();
  await Promise.all(interaction.client.guilds.cache.map(async (guild) =>
  {
    await saveFile(`./resources/backups/points-${guild.id}.json`, globalPoints[guild.id]);
    await saveFile(`./resources/backups/reputation-${guild.id}.json`, reputationPoints[guild.id]);
    await saveFile(`./resources/backups/seniority-${guild.id}.json`, seniority[guild.id]);
  }));
  await interaction.editReply("saved");
};

export { save };

