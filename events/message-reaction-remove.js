import { EmbedBuilder } from "discord.js";
import { customChannels } from "../resources/custom-channels.js";
import { customPoints, getCalculatedPoints } from "../resources/custom-points.js";
import { getCustomRole } from "../resources/general-utilities.js";
import { reputationPoints } from "./ready.js";

/**
 * @param { import("discord.js").MessageReaction } messageReaction
 * @param { import("discord.js").User } user
 */
const messageReactionRemove = async (messageReaction, user) => {
  if (user.id !== messageReaction.message.author.id && !messageReaction.message.author.bot) {
    const channel = messageReaction.message.guild.channels.cache.find((channel) => channel.name === customChannels.public)
      || messageReaction.message.guild.channels.cache.get(messageReaction.message.guild.publicUpdatesChannelId);
    const channelPrivate = messageReaction.message.guild.channels.cache.find((channel) => channel.name === customChannels.private)
      || messageReaction.message.guild.channels.cache.get(messageReaction.message.guild.publicUpdatesChannelId);
    const message = new EmbedBuilder();
    const maker = messageReaction.message.guild.members.cache.get(user.id);
    const taker = messageReaction.message.guild.members.cache.get(messageReaction.message.author.id);

    let isResponsabile = undefined;
    let makerPoints = undefined;
    let makerRole = undefined;
    let takerPoints = undefined;
    let takerRole = undefined;

    if (maker !== undefined) {
      makerPoints = getCalculatedPoints(customPoints.messageReactionAdd.maker, reputationPoints[maker.guild.id][maker.id].points);
      makerRole = getCustomRole(maker);
      isResponsabile = maker.roles.cache.find((role) => role.name === "responsabile");
    } else {
      return console.error("maker not found");
    }

    if (taker !== undefined) {
      takerPoints = getCalculatedPoints(customPoints.messageReactionAdd.taker, reputationPoints[taker.guild.id][taker.id].points);
      takerRole = getCustomRole(taker);
    } else {
      return console.error("taker not found");
    }

    if (messageReaction.emoji.name === "⚠️") {
      if (areValidRoles(makerRole, isResponsabile)) {
        user.client.emit("activity", maker, -makerPoints);
        user.client.emit("activity", taker, takerPoints);

        message
          .setTitle("⚠️ violation removed")
          .setDescription(`${makerRole} *${maker}* removed a violation of ${takerRole} *${taker}* in *${messageReaction.message.channel.name}*`)
          .addFields({ name: "promotion points", value: `${-takerPoints} ⭐`, inline: true })
          .addFields({ name: "to", value: `${taker}`, inline: true })
          .setThumbnail(taker.displayAvatarURL({ dynamic: true }))
          .setFooter({ text: `${makerPoints} ⭐ to ${maker.displayName}`, iconURL: `${maker.displayAvatarURL()}` })
          .setTimestamp()
          .setColor("DarkGreen");

        channelPrivate.send({ embeds: [message] });
      }
    } else {
      user.client.emit("activity", maker, -makerPoints);
      user.client.emit("activity", taker, -takerPoints);

      message
        .setTitle("🧸 reaction")
        .setDescription(`${makerRole} *${maker}* removed ${messageReaction.emoji} to message sent by ${takerRole} *${taker}* in *${messageReaction.message.channel.name}*`)
        .addFields({ name: "promotion points", value: `${-takerPoints} ⭐`, inline: true })
        .addFields({ name: "to", value: `${taker}`, inline: true })
        .setThumbnail(taker.displayAvatarURL({ dynamic: true }))
        .setFooter({ text: `${-makerPoints} ⭐ to ${maker.displayName}`, iconURL: `${maker.displayAvatarURL()}` })
        .setTimestamp()
        .setColor(makerRole.color);

      channel.send({ embeds: [message] });
    }
  }
};

const areValidRoles = (makerRole, makerIsResponsabile) => {
  if (makerRole.name === "presidente") return true;
  else if (makerRole.name === "ministro") return true;
  else if (makerRole.name === "senatore") return true;
  else if (makerRole.name === "governatore") return true;
  else if (makerIsResponsabile !== undefined) return true;
  else return false;
};

export { messageReactionRemove };

