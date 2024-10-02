import {
  globalPoints,
  reputationPoints,
  seniority
} from "../events/ready.js";
import {
  saveFile
} from "../resources/general-utilities.js";

/** 
 * @param {import("discord.js").Interaction} interaction 
 */
async function save(
  interaction
) {
  await interaction.deferReply();
  interaction.client.guilds.cache.forEach(
    function (
      guild
    ) {
      saveFile(
        `./resources/backups/points-${guild.id}.json`,
        globalPoints[guild.id]);
      saveFile(
        `./resources/backups/reputation-${guild.id}.json`,
        reputationPoints[guild.id]);
      saveFile(
        `./resources/backups/seniority-${guild.id}.json`,
        seniority[guild.id]);
    }
  );
  await interaction.editReply(
    "saved"
  );
}

export {
  save
};

