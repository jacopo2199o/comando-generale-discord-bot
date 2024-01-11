import { EmbedBuilder } from "discord.js";
import { customChannels } from "../resources/custom-channels.js";
import { getCustomRole } from "../resources/general-utilities.js";
import { customPoints } from "../resources/custom-points.js";

/**
 * @param { import("discord.js").MessageReaction } messageReaction
 * @param { import("discord.js").User } user
 */
const messageReactionAdd = async (messageReaction, user) => {
  if (!user.bot && user.id !== messageReaction.message.author.id && !messageReaction.message.author.bot) {
    const customChannel = messageReaction.message.guild.channels.cache.find((channel) => channel.name === customChannels.public);
    const guildMemberMaker = messageReaction.message.guild.members.cache.find((member) => member.id === user.id);
    const guildMemberTaker = messageReaction.message.guild.members.cache.find((member) => member.id === messageReaction.message.author.id);
    const customRoleMaker = getCustomRole(guildMemberMaker);
    const customRoleTaker = getCustomRole(guildMemberTaker);
    
    let embedMessage = new EmbedBuilder();

    messageReaction.client.emit("activity", guildMemberMaker, customPoints.messageReactionAdd.maker);
    messageReaction.client.emit("activity", guildMemberTaker, customPoints.messageReactionAdd.taker);

    embedMessage
      .setTitle("🧸 reaction")
      .setDescription(`${customRoleMaker} *${guildMemberMaker}* reacted ${messageReaction.emoji} to message sent by ${customRoleTaker} *${guildMemberTaker}* in *${messageReaction.message.channel.name}*\n`)
      .addFields({ name: "promotion points", value: `+${customPoints.messageReactionAdd.taker} ⭐`, inline: true })
      .addFields({ name: "to", value: `${guildMemberTaker}`, inline: true })
      .setThumbnail(guildMemberTaker.displayAvatarURL({ dynamic: true }))
      .setFooter({ text: `+${customPoints.messageReactionAdd.maker} ⭐ to ${guildMemberMaker.displayName}`, iconURL: `${guildMemberMaker.displayAvatarURL()}` })
      .setTimestamp()
      .setColor(customRoleMaker.color);

    customChannel.send({ embeds: [embedMessage] });
  }
};

export { messageReactionAdd };