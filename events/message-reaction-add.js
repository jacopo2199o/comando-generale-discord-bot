import { EmbedBuilder } from "discord.js";
import { customChannels } from "../resources/custom-channels.js";
import { customPoints } from "../resources/custom-points.js";
import { getCustomRole } from "../resources/general-utilities.js";

/**
 * @param { import("discord.js").MessageReaction } messageReaction
 * @param { import("discord.js").User } user
 */
const messageReactionAdd = async (messageReaction, user) => {
  if (user.id !== messageReaction.message.author.id && !messageReaction.message.author.bot) {
    const embedMessage = new EmbedBuilder();
    const guildMemberMaker = messageReaction.message.guild.members.cache.get(user.id);
    const guildMemberTaker = messageReaction.message.guild.members.cache.get(messageReaction.message.author.id);
    const customRoleMaker = getCustomRole(
      messageReaction.message.guild.members.cache.get(user.id)
    );
    const customRoleTaker = getCustomRole(
      messageReaction.message.guild.members.cache.get(messageReaction.message.author.id)
    );

    if (messageReaction.emoji.name === "⚠️") {
      const customChannel = messageReaction.message.guild.channels.cache.find((channel) => channel.name === customChannels.private);
      const penaltyPoints = -customPoints.messageReactionAdd.taker;

      embedMessage
        .setTitle("⚠️ potential violation")
        .setDescription(`${customRoleMaker} *${guildMemberMaker}* spotted a messagge sent by ${customRoleTaker} *${guildMemberTaker}* in *${messageReaction.message.channel.name}*`)
        .addFields({ name: "content", value: `${messageReaction.message.content}`, inline: false })
        .addFields({ name: "promotion points", value: `${penaltyPoints} ⭐`, inline: true })
        .addFields({ name: "to", value: `${guildMemberTaker}`, inline: true })
        .setThumbnail(guildMemberTaker.displayAvatarURL({ dynamic: true }))
        .setFooter({ text: `${customPoints.messageReactionAdd.maker} ⭐ to ${guildMemberMaker.displayName}`, iconURL: `${guildMemberMaker.displayAvatarURL()}` })
        .setTimestamp()
        .setColor(customRoleMaker.color);

      customChannel.send({ embeds: [embedMessage] });
    } else {
      const customChannel = messageReaction.message.guild.channels.cache.find((channel) => channel.name === customChannels.public);

      messageReaction.client.emit("activity", guildMemberMaker, customPoints.messageReactionAdd.maker);
      messageReaction.client.emit("activity", guildMemberTaker, customPoints.messageReactionAdd.taker);

      embedMessage
        .setTitle("🧸 reaction")
        .setDescription(`${customRoleMaker} *${guildMemberMaker}* reacted ${messageReaction.emoji} to message sent by ${customRoleTaker} *${guildMemberTaker}* in *${messageReaction.message.channel.name}*`)
        .addFields({ name: "promotion points", value: `${customPoints.messageReactionAdd.taker} ⭐`, inline: true })
        .addFields({ name: "to", value: `${guildMemberTaker}`, inline: true })
        .setThumbnail(guildMemberTaker.displayAvatarURL({ dynamic: true }))
        .setFooter({ text: `${customPoints.messageReactionAdd.maker} ⭐ to ${guildMemberMaker.displayName}`, iconURL: `${guildMemberMaker.displayAvatarURL()}` })
        .setTimestamp()
        .setColor(customRoleMaker.color);

      customChannel.send({ embeds: [embedMessage] });
    }

    if (messageReaction.emoji.name === "☕") {
      embedMessage
        .setDescription(`${customRoleMaker} *${guildMemberMaker}* offered a ${messageReaction.emoji} to ${customRoleTaker} *${guildMemberTaker}* in *${messageReaction.message.channel.name}*`)
        .setFooter({ text: `${customPoints.messageReactionAdd.taker} ⭐ to ${guildMemberTaker.displayName}`, iconURL: `${guildMemberTaker.displayAvatarURL()}` })
        .setTimestamp()
        .setColor(customRoleMaker.color);

      messageReaction.message.channel.send({ embeds: [embedMessage] });
    }
  }
};

export { messageReactionAdd };

