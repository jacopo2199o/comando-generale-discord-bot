import { EmbedBuilder } from "discord.js";
import { getCustomRole } from "../resources/custom-roles.js";

/**
 * @param {import("discord.js").Interaction} interaction 
 */
const givePromotionPoints = async (interaction) =>
{
  /**
   * @type { import("discord.js").User }
  */
  const user = interaction.options.getUser("member");
  const maker = interaction.guild.members.cache.get(interaction.member.id);
  const taker = interaction.guild.members.cache.get(user.id);
  if (maker === undefined || taker === undefined)
  {
    return console.error("give promotion points: maker or taker undefined");
  }
  const makerRole = getCustomRole(maker);
  const takerRole = getCustomRole(taker);
  if (makerRole === undefined || takerRole === undefined)
  {
    return console.error("give promotion points: maker role or taker role undefined");
  }
  interaction.client.emit("activity", taker, points);
  await interaction.deferReply();
  const message = new EmbedBuilder();
  message.setTitle("🔰 promotion points");
  const points = interaction.options.getNumber("points");
  const pointsString = points > 1 ? "promotion points" : "promotion point";
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

