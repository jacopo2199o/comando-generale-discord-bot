import { EmbedBuilder } from "discord.js";
import { reputationPoints } from "../events/ready.js";
import { customPoints, getCalculatedPoints } from "../resources/custom-points.js";
import { getCustomRole } from "../resources/general-utilities.js";

/**
 * @param {import("discord.js").Interaction} interaction 
 */
const rollDice = async (interaction) => {
  const message = new EmbedBuilder();

  let maker = interaction.member;
  let makerPoints = getCalculatedPoints(
    customPoints.interactionCreate,
    reputationPoints[interaction.guild.id][maker.id].points
  );
  let makerRole = getCustomRole(interaction.member);
  let result = Math.round(Math.random() * 10);

  if (result < 1) {
    result = 1;
  } else if (result > 6) {
    result = 6;
  }

  await interaction.deferReply();

  message
    .setDescription(`${makerRole} *${maker}* rolled a dice`)
    .addFields({ name: "result", value: `${result} 🎲`, inline: true })
    .setTimestamp()
    .setFooter({ text: `${makerPoints} ⭐ to ${maker.displayName}`, iconURL: `${maker.displayAvatarURL()}` })
    .setColor(makerRole.color);

  await interaction.editReply({embeds: [message]});
};

export { rollDice };

