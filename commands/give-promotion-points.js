import { EmbedBuilder } from "discord.js";
import { getCustomRole } from "../resources/custom-roles.js";

/**
 * @param {import("discord.js").Interaction} interaction 
 */
const givePromotionPoints = async (interaction) => {
  await interaction.deferReply();
  const maker = interaction.guild.members.cache.get(interaction.member.id);
  const user = interaction.options.getUser("member");
  const taker = interaction.guild.members.cache.get(user.id);

  if (maker === undefined || taker === undefined) {
    return console.error(maker, taker);
  }

  const makerRole = getCustomRole(maker);
  const takerRole = getCustomRole(taker);

  if (makerRole === undefined || takerRole === undefined) {
    return console.error(makerRole, takerRole);
  }

  const points = interaction.options.getNumber("points");
  const pointsString = (points > 1) ? "promotion points" : "promotion point";
  interaction.client.emit("activity", taker, points);
  const message = new EmbedBuilder();
  message.setTitle("🔰 promotion points");
  message.setDescription(`${makerRole} *${maker}* give ${points} *${pointsString}* to ${takerRole} *${taker}*`);
  message.addFields({ name: "promotion points", value: `${points} ⭐`, inline: true });
  message.addFields({ name: "to", value: `${taker}`, inline: true });
  message.setThumbnail(taker.displayAvatarURL({ dynamic: true }));
  message.setFooter({ text: `${maker.displayName}`, iconURL: `${maker.displayAvatarURL()}` });
  message.setTimestamp();
  message.setColor(makerRole.color);
  await interaction.editReply({ embeds: [message] });
};

export { givePromotionPoints };

