import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from "discord.js";
import { customChannels } from "../resources/custom-channels.js";
import { drops } from "../resources/custom-points.js";

/**
 * @param {import("discord.js").Channel}channel
 */
const drop = async (channel) => {
  const publicChannel = channel.guild.channels.cache.find((channel) => channel.name === customChannels.internal)
    || channel.guild.channels.cache.get(channel.guild.publicUpdatesChannelId);
  const acceptButton = new ButtonBuilder();
  const embedMessage = new EmbedBuilder();
  const publicEmbedMessage = new EmbedBuilder();
  const action = new ActionRowBuilder();

  acceptButton
    .setCustomId("take")
    .setLabel("take")
    .setStyle(ButtonStyle.Success);

  action.addComponents(acceptButton);

  embedMessage
    .setTitle("📦 new drop")
    .setDescription("press the button below to take it")
    .addFields({ name: "type", value: "promotion points", inline: true })
    .addFields({ name: "value", value: `${drops.promotionPoints} ⭐`, inline: true })
    .setThumbnail(channel.client.user.displayAvatarURL({ dynamic: true }))
    .setTimestamp()
    .setColor("DarkGreen");

  publicEmbedMessage
    .setTitle("📦 new drop")
    .setDescription(`a *promotion points* drop spawned in ${channel.name}`)
    .addFields({ name: "type", value: "promotion points", inline: true })
    .addFields({ name: "value", value: `${drops.promotionPoints} ⭐`, inline: true })
    .setThumbnail(channel.client.user.displayAvatarURL({ dynamic: true }))
    .setTimestamp()
    .setColor("DarkGreen");

  await channel.send({ embeds: [embedMessage], components: [action] });
  await publicChannel.send({ embeds: [publicEmbedMessage] });
};

export { drop };

