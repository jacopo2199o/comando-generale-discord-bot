import { EmbedBuilder } from "discord.js";
import { reputationPoints } from "../events/ready.js";
import { getCustomRole } from "../resources/custom-roles.js";

/**
 * @param {import("discord.js").Interaction} interaction
 */
const viewReputationPoints = async (interaction) =>
{
  const user = interaction.options.getUser("member");
  const member = interaction.guild.members.cache.get(user?.id) ?? interaction.guild.members.cache.get(interaction.member.id);
  if (member === undefined)
  {
    return console.error("view reputation points: member undefined");
  }
  const role = getCustomRole(member);
  if (role === undefined)
  {
    return console.error("view reputation points: role undefined");
  }
  await interaction.deferReply();
  if (user !== null)
  {
    const message = new EmbedBuilder();
    message.setTitle("🏵 reputation points");
    message.setDescription(`${role} *${member}* have ${reputationPoints[member.guild.id][member.id].points} *reputation points*`);
    message.setThumbnail(member.displayAvatarURL({ dynamic: true }));
    message.setTimestamp();
    message.setColor(role.color);
    await interaction.editReply({ embeds: [message] });
  }
  else
  {
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

