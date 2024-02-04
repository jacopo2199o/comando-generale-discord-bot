import { EmbedBuilder } from "discord.js";
import { customChannels } from "../resources/custom-channels.js";
import { customPoints, getCalculatedPoints } from "../resources/custom-points.js";
import { getCustomRole, hasModerationRole } from "../resources/custom-roles.js";
import { reputationPoints } from "./ready.js";

/**
 * @param { import("discord.js").MessageReaction } reaction
 * @param { import("discord.js").User } user
 */
const messageReactionRemove = async (reaction, user) => {
  if (user.id === reaction.message.author.id || reaction.message.author.bot === true) {
    return;
  }

  const maker = reaction.message.guild.members.cache.get(user.id);
  const taker = reaction.message.guild.members.cache.get(reaction.message.author.id);

  if (maker === undefined || taker === undefined) {
    return console.error(maker, taker);
  }

  const makerRole = getCustomRole(maker);
  const takerRole = getCustomRole(taker);

  if (makerRole === undefined || takerRole === undefined) {
    return console.error(makerRole, takerRole);
  }

  const isResponsabile = maker.roles.cache.has((role) => role.name === "responsabile");
  const makerPoints = getCalculatedPoints(customPoints.messageReactionAdd.maker, reputationPoints[maker.guild.id][maker.id].points);
  const takerPoints = getCalculatedPoints(customPoints.messageReactionAdd.taker, reputationPoints[taker.guild.id][taker.id].points);

  if (reaction.emoji.name === "⚠️" && hasModerationRole(makerRole, isResponsabile) === true) {
    user.client.emit("activity", maker, -makerPoints);
    user.client.emit("activity", taker, takerPoints);
    const message = new EmbedBuilder();
    message.setTitle("⚠️ violation removed");
    message.setDescription(`${makerRole} *${maker}* removed a violation of ${takerRole} *${taker}* in *${reaction.message.channel.name}*`);
    message.addFields({ name: "promotion points", value: `${-takerPoints} ⭐`, inline: true });
    message.addFields({ name: "to", value: `${taker}`, inline: true });
    message.setThumbnail(taker.displayAvatarURL({ dynamic: true }));
    message.setFooter({ text: `${makerPoints} ⭐ to ${maker.displayName}`, iconURL: `${maker.displayAvatarURL()}` });
    message.setTimestamp();
    message.setColor("DarkGreen");
    const channel = reaction.message.guild.channels.cache.find((channel) => channel.name === customChannels.private)
      || reaction.message.guild.channels.cache.get(reaction.message.guild.publicUpdatesChannelId);
    channel.send({ embeds: [message] });
  } else {
    user.client.emit("activity", maker, -makerPoints);
    user.client.emit("activity", taker, -takerPoints);
    const message = new EmbedBuilder();
    message.setTitle("🧸 reaction");
    message.setDescription(`${makerRole} *${maker}* removed ${reaction.emoji} to message sent by ${takerRole} *${taker}* in *${reaction.message.channel.name}*`);
    message.addFields({ name: "promotion points", value: `${-takerPoints} ⭐`, inline: true });
    message.addFields({ name: "to", value: `${taker}`, inline: true });
    message.setThumbnail(taker.displayAvatarURL({ dynamic: true }));
    message.setFooter({ text: `${-makerPoints} ⭐ to ${maker.displayName}`, iconURL: `${maker.displayAvatarURL()}` });
    message.setTimestamp();
    message.setColor(makerRole.color);
    const channel = reaction.message.guild.channels.cache.find((channel) => channel.name === customChannels.public)
      || reaction.message.guild.channels.cache.get(reaction.message.guild.publicUpdatesChannelId);
    channel.send({ embeds: [message] });
  }
};

export { messageReactionRemove };

