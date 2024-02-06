import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from "discord.js";
import { customChannels } from "../resources/custom-channels.js";
import { drops } from "../resources/custom-points.js";
import { getCustomRole } from "../resources/custom-roles.js";

/**
 * @param {import("discord.js").Interaction} interaction 
 */
const takePromotionPoints = async (interaction) => {
  const button = new ButtonBuilder();
  button.setCustomId("takenPromotionPoints");
  button.setLabel("taken");
  button.setStyle(ButtonStyle.Danger);
  button.setDisabled(true);
  const actionRow = new ActionRowBuilder();
  actionRow.setComponents(button);
  interaction.client.emit("activity", interaction.member, drops.promotionPoints);
  interaction.update({ content: `*${interaction.member}* took the drop`, components: [actionRow] });
  const role = getCustomRole(interaction.member) ?? "n.a.";
  const message = new EmbedBuilder();
  message.setTitle("📦 drop taken");
  message.setDescription(`${role} *${interaction.member}* took the drop`);
  message.addFields({ name: "type", value: "promotion points", inline: true });
  message.addFields({ name: "value", value: `${drops.promotionPoints} ⭐`, inline: true });
  message.setThumbnail(interaction.member.displayAvatarURL({ dynamic: true }));
  message.setTimestamp();
  message.setColor("DarkGreen");
  const channel = interaction.guild.channels.cache.find((channel) => channel.name === customChannels.public)
    ?? interaction.guild.channels.cache.get(interaction.guild.publicUpdatesChannel);
  channel.send({ embeds: [message] });
};

export { takePromotionPoints };

