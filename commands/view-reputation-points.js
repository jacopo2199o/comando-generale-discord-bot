import { EmbedBuilder } from "discord.js";
import { reputationPoints } from "../events/ready.js";
import { getCustomRole } from "../resources/custom-roles.js";

/**
 * @param {import("discord.js").Interaction} interaction
 */
const viewReputationPoints = async (interaction) => {
  await interaction.deferReply();
  const user = interaction.options.getUser("member");
  let member = undefined;
  
  if (user !== null) {
    member = interaction.guild.members.cache.get(user.id);
  } else {
    member = interaction.guild.members.cache.get(interaction.member.id);
  }

  if (member === undefined) {
    return console.error(member);
  }

  const role = getCustomRole(member);

  if (role === undefined) {
    return console.error(role);
  }

  if (user !== null) {
    const message = new EmbedBuilder();
    message.setTitle("🏵 reputation points");
    message.setDescription(`${role} *${member}* have ${reputationPoints[member.guild.id][member.id].points} *reputation points*`);
    message.setThumbnail(member.displayAvatarURL({ dynamic: true }));
    message.setTimestamp();
    message.setColor(role.color);
    await interaction.editReply({ embeds: [message] });
  } else {
    const message = new EmbedBuilder();
    message.setTitle("🏵 reputation points");
    message.setDescription(`you have ${reputationPoints[member.guild.id][member.id].points} *reputation points*`);
    message.setThumbnail(member.displayAvatarURL({ dynamic: true }));
    message.setTimestamp();
    message.setColor(role.color);
    await interaction.editReply({ embeds: [message] });
  }
};

export { viewReputationPoints };

