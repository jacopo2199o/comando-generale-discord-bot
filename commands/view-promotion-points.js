import { EmbedBuilder } from "discord.js";
import { globalPoints } from "../events/ready.js";
import { customPoints, getLevel } from "../resources/custom-points.js";
import { getCustomRole } from "../resources/custom-roles.js";

/**
 * @param {import("discord.js").Interaction} interaction
 */
const viewPromotionPoints = async (interaction) => {
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

  const level = getLevel(member);
  const points = globalPoints[member.guild.id][member.id] % customPoints.promotionPoints;

  if (user !== null) {
    const message = new EmbedBuilder();
    message.setTitle("⭐ promotion points");
    message.setDescription(`${role} *${member}* have ${points}/${customPoints.promotionPoints} (lvl. ${level}) *promotion points*`);
    message.setThumbnail(member.displayAvatarURL({ dynamic: true }));
    message.setTimestamp();
    message.setColor(role.color);
    await interaction.editReply({ embeds: [message] });
  } else {
    const message = new EmbedBuilder();
    message.setTitle("⭐ promotion points");
    message.setDescription(`you have ${points}/${customPoints.promotionPoints} (lvl. ${level}) *promotion points*`);
    message.setThumbnail(interaction.member.displayAvatarURL({ dynamic: true }));
    message.setTimestamp();
    message.setColor(role.color);
    await interaction.editReply({ embeds: [message] });
  }
};

export { viewPromotionPoints };

