import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from "discord.js";
import { customChannels } from "../resources/custom-channels.js";
import { drops } from "../resources/custom-points.js";

/**
 * @param {import("discord.js").Channel} dropChannel
 */
const dropPromotionPoints = async (dropChannel) => {
  const actionRow = new ActionRowBuilder();
  const button = new ButtonBuilder();
  const channel = dropChannel.guild.channels.cache.find((channel) => channel.name === customChannels.public)
    || dropChannel.guild.channels.cache.get(dropChannel.guild.publicUpdatesChannelId);
  const message1 = new EmbedBuilder();
  const message2 = new EmbedBuilder();

  actionRow
    .addComponents(button
      .setCustomId("take")
      .setLabel("take")
      .setStyle(ButtonStyle.Success));
  message1
    .setTitle("📦⭐ new drop")
    .setDescription("based on messages sent globally in this server. take it pressing the button below")
    .addFields({ name: "type", value: "promotion points", inline: true })
    .addFields({ name: "value", value: `${drops.promotionPoints} ⭐`, inline: true })
    .setThumbnail(dropChannel.client.user.displayAvatarURL({ dynamic: true }))
    .setTimestamp()
    .setColor("DarkGreen");
  message2
    .setTitle("📦⭐ new drop")
    .setDescription(`a *promotion points* drop spawned in ${dropChannel.name}`)
    .addFields({ name: "type", value: "promotion points", inline: true })
    .addFields({ name: "value", value: `${drops.promotionPoints} ⭐`, inline: true })
    .setThumbnail(dropChannel.client.user.displayAvatarURL({ dynamic: true }))
    .setTimestamp()
    .setColor("DarkGreen");

  await dropChannel.send({ embeds: [message1], components: [actionRow] });
  await channel.send({ embeds: [message2] });
};

export { dropPromotionPoints };

