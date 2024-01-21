import { EmbedBuilder } from "discord.js";
import { customChannels } from "../resources/custom-channels.js";
import { customPoints, drops, getCalculatedPoints } from "../resources/custom-points.js";
import { getCustomRole } from "../resources/general-utilities.js";
import { reputationPoints } from "./ready.js";

let dropCount = 0;
/**
 * @param { import("discord.js").Message } message
 */
const messageCreate = async (message) => {
  if (!message.author.bot) {
    const channel = message.guild.channels.cache.find((channel) => channel.name === customChannels.public)
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
    }

    message.client.emit("activity", maker, makerPoints);

    dropCount++;

    if (dropCount > drops.promotionPoints) {
      dropCount = 0;
      message.client.emit("drop", message.channel);
    }

    embedMessage
      .setDescription(`💬 ${makerRole} *${maker}* sended a new message in *${message.channel.name}*`)
      .setFooter({ text: `${makerPoints} ⭐ to ${maker.displayName}`, iconURL: `${maker.displayAvatarURL()}` })
      .setTimestamp()
      .setColor(makerRole.color);

    channel.send({ embeds: [embedMessage] });
  }
};

export { messageCreate };

