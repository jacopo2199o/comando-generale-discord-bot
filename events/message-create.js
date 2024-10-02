import {
  EmbedBuilder
} from "discord.js";
import {
  customChannels
} from "../resources/custom-channels.js";
import {
  customPoints,
  drops,
  getCalculatedPoints
} from "../resources/custom-points.js";
import {
  getCustomRole
} from "../resources/custom-roles.js";
import {
  cooldowns,
  reputationPoints,
  transfers
} from "./ready.js";

let dropPromotionPointsCounter = 0;
/**
 * @param { import("discord.js").Message } newMessage
 */
async function messageCreate(
  newMessage
) {
  await newMessage.fetch();
  if (
    newMessage.author.bot === true
  ) {
    return;
  }
  const maker = newMessage.member;
  if (
    cooldowns[newMessage.guild.id][maker.id] !== undefined &&
    newMessage.channel.isThread() === false
  ) {
    const isExpiredPeriod = cooldowns[newMessage.guild.id][maker.id].endPeriod < new Date().getTime() ? true : false;
    if (
      isExpiredPeriod === false
    ) {
      const isExpiredInterval = cooldowns[newMessage.guild.id][maker.id].endinterval < new Date().getTime() ? true : false;
      if (
        isExpiredInterval === true
      ) {
        const nextInterval = 1000 * 60 * 60 * cooldowns[newMessage.guild.id][maker.id].interval;
        cooldowns[newMessage.guild.id][maker.id].endInterval = new Date().getTime() + nextInterval;
        return;
      } else {
        newMessage.delete();
        return;
      }
    }
  }
  if (
    transfers[newMessage.guild.id][maker.id] !== undefined &&
    newMessage.channel.isThread() === false
  ) {
    const isExpiredPeriod = transfers[newMessage.guild.id][maker.id].endPeriod < new Date().getTime() ? true : false;
    if (
      isExpiredPeriod === false
    ) {
      newMessage.delete();
      return;
    }
  }
  const makerRole = getCustomRole(
    maker
  );
  if (
    makerRole === undefined
  ) {
    return console.error("message create: maker role undefined");
  }
  const makerPoints = getCalculatedPoints(
    customPoints.messageCreate,
    reputationPoints[maker.guild.id][maker.id].points
  );
  newMessage.client.emit(
    "activity",
    maker,
    makerPoints
  );
  // point drop
  dropPromotionPointsCounter++;
  if (
    dropPromotionPointsCounter > drops.promotionPoints
  ) {
    dropPromotionPointsCounter = 0;
    newMessage.client.emit(
      "dropPromotionPoints",
      newMessage.channel
    );
  }
  const message = new EmbedBuilder();
  message.setDescription(
    `💬 ${makerRole} *${maker}* sended a new message in *${newMessage.channel.name}*`
  );
  message.setFooter(
    {
      text: `${makerPoints} ⭐ to ${maker.displayName}`,
      iconURL: `${maker.displayAvatarURL()}`
    }
  );
  message.setTimestamp();
  message.setColor(
    makerRole.color
  );
  const channel = newMessage.guild.channels.cache.find(
    function (
      channel
    ) {
      return channel.name === customChannels.public;
    }
  ) ?? newMessage.guild.publicUpdatesChannel;
  channel.send(
    {
      embeds: [
        message
      ]
    }
  );
}

export {
  messageCreate
};

