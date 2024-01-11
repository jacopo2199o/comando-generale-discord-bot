import { EmbedBuilder } from "discord.js";
import { promotionPoints } from "../events/ready.js";
import { customPoints } from "../resources/custom-points.js";
import { getCustomRole } from "../resources/general-utilities.js";

/**
 * @param {import("discord.js").Interaction} interaction
 */
const viewPromotionPoints = async (interaction) => {
  const userOption = interaction.options.getUser("member");

  let customRole = undefined;
  let embedMessage = new EmbedBuilder();
  
  await interaction.deferReply();
  
  if (userOption) {
    const guildMember = interaction.guild.members.cache.find((member) => member.id === userOption.id);
    
    customRole = getCustomRole(guildMember);

    embedMessage
      .setTitle("⭐ promotion points")
      .setDescription(`*${guildMember}* have ${promotionPoints[guildMember.id]}/${customPoints.promotionPoints} *promotion points*\n`)
      .setThumbnail(guildMember.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(customRole.color);

    await interaction.editReply({ embeds: [embedMessage] });
  } else {
    customRole = getCustomRole(interaction.member);

    embedMessage
      .setTitle("⭐ promotion points")
      .setDescription(`you have ${promotionPoints[interaction.member.id]}/${customPoints.promotionPoints} *promotion points*\n`)
      .setThumbnail(interaction.member.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(customRole.color);

    await interaction.editReply({ embeds: [embedMessage] });
  }
};

export { viewPromotionPoints };