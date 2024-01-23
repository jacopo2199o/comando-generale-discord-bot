import { EmbedBuilder } from "discord.js";
import { globalPoints } from "../events/ready.js";
import { customPoints } from "../resources/custom-points.js";
import { getCustomRole } from "../resources/general-utilities.js";

/**
 * @param {import("discord.js").Interaction} interaction
 */
const viewPromotionPoints = async (interaction) => {
  const message = new EmbedBuilder();
  const members = await interaction.guild.members.fetch();
  const userOption = interaction.options.getUser("member");

  let target = undefined;
  let targetRole = undefined;

  if (userOption !== null) {
    target = members.get(userOption.id);
  } else {
    target = members.get(interaction.member.id);
  }

  if (target !== undefined) {
    targetRole = getCustomRole(target);
  }

  await interaction.deferReply();

  if (userOption !== null) {
    message
      .setTitle("⭐ promotion points")
      .setDescription(`${targetRole} *${target}* have ${globalPoints[target.guild.id][target.id] % customPoints.promotionPoints}/${customPoints.promotionPoints} *promotion points*\n`)
      .setThumbnail(target.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(targetRole.color);

    await interaction.editReply({ embeds: [message] });
  } else {
    message
      .setTitle("⭐ promotion points")
      .setDescription(`you have ${globalPoints[target.guild.id][target.id]}/${customPoints.promotionPoints} *promotion points*\n`)
      .setThumbnail(interaction.member.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(targetRole.color);

    await interaction.editReply({ embeds: [message] });
  }
};

export { viewPromotionPoints };

