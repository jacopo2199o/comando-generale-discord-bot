import { EmbedBuilder } from "discord.js";
import { customChannels } from "../resources/custom-channels.js";
import { customPoints, drops, getCalculatedPoints } from "../resources/custom-points.js";
import { getCustomRole } from "../resources/custom-roles.js";
import { reputationPoints } from "./ready.js";

let dropPromotionPointsCounter = 0;

/**
 * @param { import("discord.js").Message } newMessage
 */
const messageCreate = async (newMessage) => {
  await newMessage.fetch();
  
  if (newMessage.author.bot) {
    return;
  }

  const maker = newMessage.guild.members.cache.get(newMessage.author.id);

  if (maker === undefined) {
    return console.error(maker);
  }

  const makerRole = getCustomRole(maker);

  if (makerRole === undefined) {
    return console.error(makerRole);
  }

  const makerPoints = getCalculatedPoints(customPoints.messageCreate, reputationPoints[maker.guild.id][maker.id].points);
  newMessage.client.emit("activity", maker, makerPoints);
  dropPromotionPointsCounter++;

  if (dropPromotionPointsCounter > drops.promotionPoints) {
    dropPromotionPointsCounter = 0;
    newMessage.client.emit("dropPromotionPoints", newMessage.channel);
  }

  const message = new EmbedBuilder();
  message.setDescription(`💬 ${makerRole} *${maker}* sended a new message in *${newMessage.channel.name}*`);
  message.setFooter({ text: `${makerPoints} ⭐ to ${maker.displayName}`, iconURL: `${maker.displayAvatarURL()}` });
  message.setTimestamp();
  message.setColor(makerRole.color);
  const channel = newMessage.guild.channels.cache.find((channel) => channel.name === customChannels.public)
    ?? newMessage.guild.channels.cache.get(newMessage.guild.publicUpdatesChannelId);
  channel.send({ embeds: [message] });
};

export { messageCreate };

