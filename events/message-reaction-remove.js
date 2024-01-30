import { EmbedBuilder } from "discord.js";
import { customChannels } from "../resources/custom-channels.js";
import { customPoints, getCalculatedPoints } from "../resources/custom-points.js";
import { getCustomRole } from "../resources/custom-roles.js";
import { reputationPoints } from "./ready.js";

/**
 * @param { import("discord.js").MessageReaction } messageReaction
 * @param { import("discord.js").User } user
 */
const messageReactionRemove = async (messageReaction, user) => {
  if (user.id !== messageReaction.message.author.id && messageReaction.message.author.bot === false) {
    const maker = messageReaction.message.guild.members.cache.get(user.id);

    let isResponsabile = undefined;
    let makerPoints = undefined;
    let makerRole = undefined;

    if (maker !== undefined) {
      isResponsabile = maker.roles.cache.find((role) => role.name === "responsabile");
      makerPoints = getCalculatedPoints(customPoints.messageReactionAdd.maker, reputationPoints[maker.guild.id][maker.id].points);
      makerRole = getCustomRole(maker);
    } else {
      return console.error("maker not found");
    }

    const taker = messageReaction.message.guild.members.cache.get(messageReaction.message.author.id);

    let takerPoints = undefined;
    let takerRole = undefined;

    if (taker !== undefined) {
      takerPoints = getCalculatedPoints(customPoints.messageReactionAdd.taker, reputationPoints[taker.guild.id][taker.id].points);
      takerRole = getCustomRole(taker);
    } else {
      return console.error("taker not found");
    }

    if (messageReaction.emoji.name === "⚠️") {
      if (areValidRoles(makerRole, isResponsabile)) {
        const message = new EmbedBuilder();
        message.setTitle("⚠️ violation removed");
        message.setDescription(`${makerRole} *${maker}* removed a violation of ${takerRole} *${taker}* in *${messageReaction.message.channel.name}*`);
        message.addFields({ name: "promotion points", value: `${-takerPoints} ⭐`, inline: true });
        message.addFields({ name: "to", value: `${taker}`, inline: true });
        message.setThumbnail(taker.displayAvatarURL({ dynamic: true }));
        message.setFooter({ text: `${makerPoints} ⭐ to ${maker.displayName}`, iconURL: `${maker.displayAvatarURL()}` });
        message.setTimestamp();
        message.setColor("DarkGreen");

        const channel = messageReaction.message.guild.channels.cache.find((channel) => channel.name === customChannels.private)
          || messageReaction.message.guild.channels.cache.get(messageReaction.message.guild.publicUpdatesChannelId);
        channel.send({ embeds: [message] });

        user.client.emit("activity", maker, -makerPoints);
        user.client.emit("activity", taker, takerPoints);
      }
    } else {
      const message = new EmbedBuilder();
      message.setTitle("🧸 reaction");
      message.setDescription(`${makerRole} *${maker}* removed ${messageReaction.emoji} to message sent by ${takerRole} *${taker}* in *${messageReaction.message.channel.name}*`);
      message.addFields({ name: "promotion points", value: `${-takerPoints} ⭐`, inline: true });
      message.addFields({ name: "to", value: `${taker}`, inline: true });
      message.setThumbnail(taker.displayAvatarURL({ dynamic: true }));
      message.setFooter({ text: `${-makerPoints} ⭐ to ${maker.displayName}`, iconURL: `${maker.displayAvatarURL()}` });
      message.setTimestamp();
      message.setColor(makerRole.color);

      const channel = messageReaction.message.guild.channels.cache.find((channel) => channel.name === customChannels.public)
        || messageReaction.message.guild.channels.cache.get(messageReaction.message.guild.publicUpdatesChannelId);
      channel.send({ embeds: [message] });

      user.client.emit("activity", maker, -makerPoints);
      user.client.emit("activity", taker, -takerPoints);
    }
  }
};

const areValidRoles = (makerRole, makerIsResponsabile) => {
  if (makerRole.name === "presidente") {
    return true;
  }
  else if (makerRole.name === "ministro") {
    return true;
  }
  else if (makerRole.name === "senatore") {
    return true;
  }
  else if (makerRole.name === "governatore") {
    return true;
  }
  else if (makerIsResponsabile !== undefined) {
    return true;
  }
  else {
    return false;
  }
};

export { messageReactionRemove };

