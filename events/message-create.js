import { EmbedBuilder } from "discord.js";
import { customChannels } from "../resources/custom-channels.js";
import { customPoints, getCalculatedPoints } from "../resources/custom-points.js";
import { getCustomRole } from "../resources/general-utilities.js";
import { reputationPoints } from "./ready.js";

/**
 * @param { import("discord.js").Message } message
 */
const messageCreate = async (message) => {
  if (!message.author.bot) {
    const customChannel = message.guild.channels.cache.find((channel) => channel.name === customChannels.public);
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

    await message.channel.fetch();

    message.client.emit("activity", maker, makerPoints);

    embedMessage
      .setDescription(`💬 ${makerRole} *${maker}* sended a new message in *${message.channel.name}*\n`)
      .setFooter({ text: `${makerPoints} ⭐ to ${maker.displayName}`, iconURL: `${maker.displayAvatarURL()}` })
      .setTimestamp()
      .setColor(makerRole.color);

    customChannel.send({ embeds: [embedMessage] });
  }
};

export { messageCreate };

