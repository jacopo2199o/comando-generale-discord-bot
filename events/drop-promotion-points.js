import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from "discord.js";
import { customChannels } from "../resources/custom-channels.js";
import { drops } from "../resources/custom-points.js";

/**
 * @param {import("discord.js").Channel} dropChannel
 */
const dropPromotionPoints = async (dropChannel) => {
  const button = new ButtonBuilder();
  button.setCustomId("takePromotionPoints");
  button.setLabel("take");
  button.setStyle(ButtonStyle.Success);
  const actionRow = new ActionRowBuilder();
  actionRow.addComponents(button);
  const dropMessage = new EmbedBuilder();
  dropMessage.setTitle("📦 new drop");
  dropMessage.setDescription("based on messages sent globally in this server. take it pressing the button below");
  dropMessage.addFields({ name: "type", value: "promotion points", inline: true });
  dropMessage.addFields({ name: "value", value: `${drops.promotionPoints} ⭐`, inline: true });
  dropMessage.setThumbnail(dropChannel.client.user.displayAvatarURL({ dynamic: true }));
  dropMessage.setFooter({ text: "use /view-promotion-points to see yours"});
  dropMessage.setTimestamp();
  dropMessage.setColor("DarkGreen");
  const publicMessage = new EmbedBuilder();
  publicMessage.setTitle("📦 new drop");
  publicMessage.setDescription(`a *promotion points* drop spawned in *${dropChannel.name}*`);
  publicMessage.addFields({ name: "type", value: "promotion points", inline: true });
  publicMessage.addFields({ name: "value", value: `${drops.promotionPoints} ⭐`, inline: true });
  publicMessage.setThumbnail(dropChannel.client.user.displayAvatarURL({ dynamic: true }));
  publicMessage.setTimestamp();
  publicMessage.setColor("DarkGreen");
  const publicChannel = dropChannel.guild.channels.cache.find((channel) => channel.name === customChannels.public)
    ?? dropChannel.guild.publicUpdatesChannel;
  await publicChannel.send({ embeds: [publicMessage] });
  await dropChannel.send({ embeds: [dropMessage], components: [actionRow] });
};

export { dropPromotionPoints };

