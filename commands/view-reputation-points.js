import { EmbedBuilder } from "discord.js";
import { reputationPoints } from "../events/ready.js";
import { getCustomRole } from "../resources/general-utilities.js";

/**
 * @param {import("discord.js").Interaction} interaction
 */
const viewReputationPoints = async (interaction) => {
  const embedMessage = new EmbedBuilder();
  const guildMembers = await interaction.guild.members.fetch();
  const userOption = interaction.options.getUser("member");

  let target = undefined;
  let targetRole = undefined;

  if (userOption !== null) {
    target = guildMembers.get(userOption.id);
  } else {
    target = guildMembers.get(interaction.member.id);
  }

  if (target !== undefined) {
    targetRole = getCustomRole(target);
  }

  await interaction.deferReply();

  if (userOption !== null) {
    embedMessage
      .setTitle("🏵 reputation points")
      .setDescription(`${targetRole} *${target}* have ${reputationPoints[target.guild.id][target.id].points} *reputation points*\n`)
      .setThumbnail(target.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(targetRole.color);

    await interaction.editReply({ embeds: [embedMessage] });
  } else {
    embedMessage
      .setTitle("🏵 reputation points")
      .setDescription(`you have ${reputationPoints[target.guild.id][target.id].points} *reputation points*\n`)
      .setThumbnail(target.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(targetRole.color);

    await interaction.editReply({ embeds: [embedMessage] });
  }
};

export { viewReputationPoints };

