import { EmbedBuilder } from "discord.js";
import { reputationPoints } from "../events/ready.js";
import { customPoints, getCalculatedPoints } from "../resources/custom-points.js";
import { getCustomRole } from "../resources/custom-roles.js";

/**
 * @param {import("discord.js").Interaction} interaction 
 */
const rollDice = async (interaction) => {
  await interaction.deferReply();

  const roll = () => {
    let result = Math.random() * 10;

    if (result > 1 && result < 6) {
      return Math.round(result);
    } else {
      return roll();
    }
  };

  const maker = interaction.member;

  if (maker === undefined) {
    return console.error(maker);
  }

  const points = getCalculatedPoints(customPoints.interactionCreate, reputationPoints[maker.guild.id][maker.id].points);
  const result = roll();
  const role = getCustomRole(maker);
  const message = new EmbedBuilder();
  message.setDescription(`${role} *${maker}* rolled a dice`);
  message.addFields({ name: "result", value: `${result} 🎲`});
  message.setTimestamp();
  message.setFooter({ text: `${points} ⭐ to ${maker.displayName}`, iconURL: `${maker.displayAvatarURL()}` });
  message.setColor(role.color);
  await interaction.editReply({ embeds: [message] });
};

export { rollDice };

