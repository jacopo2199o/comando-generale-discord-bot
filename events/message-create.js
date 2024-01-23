import { EmbedBuilder } from "discord.js";
import { customChannels } from "../resources/custom-channels.js";
import { customPoints, drops, getCalculatedPoints } from "../resources/custom-points.js";
import { getCustomRole } from "../resources/general-utilities.js";
import { reputationPoints } from "./ready.js";

let dropPromotionPointsCounter = 0;
/**
 * @param { import("discord.js").Message } message
 */
const messageCreate = async (message) => {
  if (!message.author.bot) {
    const channelPublic = message.guild.channels.cache.find((channel) => channel.name === customChannels.public)
      || message.guild.channels.cache.get(message.guild.publicUpdatesChannelId);
    const channelWelcome = message.guild.channels.cache.find((channel) => channel.name === customChannels.welcome)
      || message.guild.channels.cache.get(message.guild.publicUpdatesChannelId);
    const embedMessage = new EmbedBuilder();
    const maker = message.guild.members.cache.get(message.author.id);

    let makerPoints = undefined;
    let makerRole = undefined;

    if (maker !== undefined) {
      makerPoints = getCalculatedPoints(
        customPoints.messageCreate,
        reputationPoints[maker.guild.id][maker.id].points
      );
      makerRole = getCustomRole(maker);
    } else {
      return;
    }

    await message.fetch();

    message.client.emit("activity", maker, makerPoints);

    dropPromotionPointsCounter++;

    if (dropPromotionPointsCounter > drops.promotionPoints) {
      dropPromotionPointsCounter = 0;

      if (message.channelId === "1196117308708507818") { // temporaneo
        message.client.emit("dropPromotionPoints", channelWelcome);
      } else {
        message.client.emit("dropPromotionPoints", message.channel);
      }
    }

    embedMessage
      .setDescription(`💬 ${makerRole} *${maker}* sended a new message in *${message.channel.name}*`)
      .setFooter({ text: `${makerPoints} ⭐ to ${maker.displayName}`, iconURL: `${maker.displayAvatarURL()}` })
      .setTimestamp()
      .setColor(makerRole.color);

    channelPublic.send({ embeds: [embedMessage] });
  }
};

export { messageCreate };

