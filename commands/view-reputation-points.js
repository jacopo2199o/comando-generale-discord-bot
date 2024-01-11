import { EmbedBuilder } from "discord.js";
import { reputationPoints } from "../events/ready.js";
import { getCustomRole } from "../resources/general-utilities.js";

/**
 * @param {import("discord.js").Interaction} interaction
 */
const viewReputationPoints = async (interaction) => {
  const userOption = interaction.options.getUser("member");

  let embedMessage = new EmbedBuilder();

  await interaction.deferReply();

  if (userOption) {
    const guildMember = interaction.guild.members.cache.find((member) => member.id === userOption.id);
    const customRole = getCustomRole(guildMember);

    embedMessage
      .setTitle("🏵 reputation points")
      .setDescription(`*${guildMember}* have ${reputationPoints[guildMember.id].points} *reputation points*\n`)
      .setThumbnail(guildMember.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(customRole.color);

    await interaction.editReply({ embeds: [embedMessage] });
  } else {
    const customRole = getCustomRole(interaction.member);

    embedMessage
      .setTitle("🏵 reputation points")
      .setDescription(`you have ${reputationPoints[interaction.member.id].points} *reputation points*\n`)
      .setThumbnail(interaction.member.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(customRole.color);

    await interaction.editReply({ embeds: [embedMessage] });
  }
};

export { viewReputationPoints };