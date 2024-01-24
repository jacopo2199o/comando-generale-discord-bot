import { EmbedBuilder } from "discord.js";
import { customChannels } from "../resources/custom-channels.js";
import { customPoints, getCalculatedPoints } from "../resources/custom-points.js";
import { getCustomRole } from "../resources/general-utilities.js";
import { reputationPoints } from "./ready.js";

/**
 * @param { import("discord.js").MessageReaction } messageReaction
 * @param { import("discord.js").User } user
 */
const messageReactionAdd = async (messageReaction, user) => {
  if (user.id !== messageReaction.message.author.id && !messageReaction.message.author.bot) {
    const channelPrivate = messageReaction.message.guild.channels.cache.find((channel) => channel.name === customChannels.private)
      || messageReaction.message.guild.channels.cache.get(messageReaction.message.guild.publicUpdatesChannelId);
    const channelPublic = messageReaction.message.guild.channels.cache.find((channel) => channel.name === customChannels.public)
      || messageReaction.message.guild.channels.cache.get(messageReaction.message.guild.publicUpdatesChannelId);
    const maker = messageReaction.message.guild.members.cache.get(user.id);
    const messageLocal = new EmbedBuilder();
    const messagePublic = new EmbedBuilder();
    const taker = messageReaction.message.guild.members.cache.get(messageReaction.message.author.id);

    let isResponsible = undefined;
    let makerPoints = undefined;
    let makerRole = undefined;
    let takerPoints = undefined;
    let takerRole = undefined;

    if (maker !== undefined) {
      isResponsible = maker.roles.cache.find((role) => role.name === "responsabile");
      makerPoints = getCalculatedPoints(
        customPoints.messageReactionAdd.maker,
        reputationPoints[maker.guild.id][maker.id].points
      );
      makerRole = getCustomRole(maker);
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
      if (areValidRoles(makerRole, isResponsible)) {
        user.client.emit("activity", maker, makerPoints);
        user.client.emit("activity", taker, -takerPoints);

        messagePublic
          .setTitle("⚠️ violation spotted")
          .setDescription(`${makerRole} *${maker}* reported a messagge sent by ${takerRole} *${taker}* in *${messageReaction.message.channel.name}*`)
          .addFields({ name: "content", value: `${messageReaction.message.content}`, inline: false })
          .addFields({ name: "promotion points", value: `${-takerPoints} ⭐`, inline: true })
          .addFields({ name: "to", value: `${taker}`, inline: true })
          .setThumbnail(taker.displayAvatarURL({ dynamic: true }))
          .setFooter({ text: `${makerPoints} ⭐ to ${maker.displayName}`, iconURL: `${maker.displayAvatarURL()}` })
          .setTimestamp()
          .setColor("DarkRed");

        channelPrivate.send({ embeds: [messagePublic] });
      }
    } else {
      user.client.emit("activity", maker, makerPoints);
      user.client.emit("activity", taker, takerPoints);

      messagePublic
        .setTitle("🧸 reaction")
        .setDescription(`${makerRole} *${maker}* reacted ${messageReaction.emoji} to message sent by ${takerRole} *${taker}* in *${messageReaction.message.channel.name}*`)
        .addFields({ name: "promotion points", value: `${takerPoints} ⭐`, inline: true })
        .addFields({ name: "to", value: `${taker}`, inline: true })
        .setThumbnail(taker.displayAvatarURL({ dynamic: true }))
        .setFooter({ text: `${makerPoints} ⭐ to ${maker.displayName}`, iconURL: `${maker.displayAvatarURL()}` })
        .setTimestamp()
        .setColor(makerRole.color);

      channelPublic.send({ embeds: [messagePublic] });
    }

    if (messageReaction.emoji.name === "☕") {
      messageLocal
        .setDescription(`🧸 ${makerRole} *${maker}* offered a ${messageReaction.emoji} coffe to ${takerRole} *${taker}* in *${messageReaction.message.channel.name}*`)
        .setFooter({ text: `${takerPoints} ⭐ to ${taker.displayName}`, iconURL: `${taker.displayAvatarURL()}` })
        .setTimestamp()
        .setColor(makerRole.color);

      messageReaction.message.channel.send({ embeds: [messageLocal] });
    } else if (messageReaction.emoji.name === "🍸") {
      messageLocal
        .setDescription(`🧸 ${makerRole} *${maker}* offered a ${messageReaction.emoji} drink to ${takerRole} *${taker}* in *${messageReaction.message.channel.name}*`)
        .setFooter({ text: `${takerPoints} ⭐ to ${taker.displayName}`, iconURL: `${taker.displayAvatarURL()}` })
        .setTimestamp()
        .setColor(makerRole.color);

      messageReaction.message.channel.send({ embeds: [messageLocal] });
    } else if (messageReaction.emoji.name === "🍷") {
      messageLocal
        .setDescription(`🧸 ${makerRole} *${maker}* offered some ${messageReaction.emoji} wine to ${takerRole} *${taker}* in *${messageReaction.message.channel.name}*`)
        .setFooter({ text: `${takerPoints} ⭐ to ${taker.displayName}`, iconURL: `${taker.displayAvatarURL()}` })
        .setTimestamp()
        .setColor(makerRole.color);

      messageReaction.message.channel.send({ embeds: [messageLocal] });
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

export { messageReactionAdd };

