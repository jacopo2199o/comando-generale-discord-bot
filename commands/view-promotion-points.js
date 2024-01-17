import { EmbedBuilder } from "discord.js";
import { globalPoints } from "../events/ready.js";
import { customPoints } from "../resources/custom-points.js";
import { getCustomRole } from "../resources/general-utilities.js";

/**
 * @param {import("discord.js").Interaction} interaction
 */
const viewPromotionPoints = async (interaction) => {
  const embedMessage = new EmbedBuilder();
  const userOption = interaction.options.getUser("member");
  const guildMembers = await interaction.guild.members.fetch();

  await interaction.deferReply();

  if (userOption) {
    const customRole = getCustomRole(
      guildMembers.get(userOption.id)
    );
    const guildMember = guildMembers.get(userOption.id);

    embedMessage
      .setTitle("⭐ promotion points")
      .setDescription(`*${guildMember}* have ${globalPoints[guildMember.guild.id][guildMember.id] % customPoints.promotionPoints}/${customPoints.promotionPoints} *promotion points*\n`)
      .setThumbnail(guildMember.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(customRole.color);

    await interaction.editReply({ embeds: [embedMessage] });
  } else {
    const customRole = getCustomRole(interaction.member);

    embedMessage
      .setTitle("⭐ promotion points")
      .setDescription(`you have ${globalPoints[interaction.guild.id][interaction.member.id]}/${customPoints.promotionPoints} *promotion points*\n`)
      .setThumbnail(interaction.member.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(customRole.color);

    await interaction.editReply({ embeds: [embedMessage] });
  }
};

export { viewPromotionPoints };

