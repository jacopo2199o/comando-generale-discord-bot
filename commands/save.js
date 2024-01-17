import { globalPoints } from "../events/ready.js";
import { saveFile } from "../resources/general-utilities.js";

/** 
 * @param {import("discord.js").Interaction} interaction 
 */
const save = async (interaction) => {
  await interaction.deferReply();
  await saveFile(`./resources/database/points-${interaction.guild.id}.json`, globalPoints[interaction.guild.id]);
  await interaction.editReply("saved");
};

export { save };

