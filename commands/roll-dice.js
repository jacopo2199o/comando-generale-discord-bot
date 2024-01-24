import { EmbedBuilder } from "discord.js";
import { reputationPoints } from "../events/ready.js";
import { customPoints, getCalculatedPoints } from "../resources/custom-points.js";
import { getCustomRole } from "../resources/general-utilities.js";

/**
 * @param {import("discord.js").Interaction} interaction 
 */
const rollDice = async (interaction) => {
  const roll = () => {
    let result = Math.random() * 10;

    if (result > 1 && result < 6) {
      return Math.round(result);
    } else {
      return roll();
    }
  };

  const maker = interaction.member;
  const message = new EmbedBuilder();

  let makerPoints = undefined;
  let makerRole = undefined;
  let result = roll();

  if (maker !== undefined) {
    makerPoints = getCalculatedPoints(customPoints.interactionCreate, reputationPoints[maker.guild.id][maker.id].points);
    makerRole = getCustomRole(maker);
  }

  await interaction.deferReply();

  message
    .setDescription(`${makerRole} *${maker}* rolled a dice`)
    .addFields({ name: "result", value: `${result} 🎲`, inline: true })
    .setTimestamp()
    .setFooter({ text: `${makerPoints} ⭐ to ${maker.displayName}`, iconURL: `${maker.displayAvatarURL()}` })
    .setColor(makerRole.color);

  await interaction.editReply({ embeds: [message] });
};

export { rollDice };

