import fs from "fs";
import { globalPoints } from "../events/ready.js";

/** 
 * @param {import("discord.js").Interaction} interaction 
 */
const save = async (interaction) => {
  await interaction.deferReply();

  fs.writeFileSync(`./resources/database/points-${interaction.guild.id}.json`, JSON.stringify(globalPoints[interaction.guild.id]));

  await interaction.editReply("saved");
};

export { save };