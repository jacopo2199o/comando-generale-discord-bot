import { EmbedBuilder } from "discord.js";
import { reputationPoints } from "../events/ready.js";
import { customRoles } from "../resources/custom-roles.js";

/**
 * @param {import("discord.js").Interaction} interaction
 */
const viewReputationPoints = async (interaction) => {
  const userOption = interaction.options.getUser("member");

  let customRole = undefined;
  let embedMessage = new EmbedBuilder();

  await interaction.deferReply();

  if (userOption) {
    const guildMember = interaction.guild.members.cache.find((member) => member.id === userOption.id);

    guildMember.roles.cache.forEach((role) => {
      const rankIndex = customRoles.findIndex((rank) => rank === role.name);

      if (rankIndex !== -1) {
        customRole = role;
      }
    });

    embedMessage
      .setTitle("🏵 reputation points")
      .setDescription(`*${guildMember}* have ${reputationPoints[guildMember.id].points} *reputation points*\n`)
      .setThumbnail(guildMember.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(customRole.color);

    await interaction.editReply({ embeds: [embedMessage] });
  } else {
    interaction.member.roles.cache.forEach((role) => {
      const rankIndex = customRoles.findIndex((rank) => rank === role.name);

      if (rankIndex !== -1) {
        customRole = role;
      }
    });

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