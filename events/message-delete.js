import { AuditLogEvent, EmbedBuilder } from "discord.js";
import { customChannels } from "../resources/custom-channels.js";
import { customPoints } from "../resources/custom-points.js";
import { getCustomRole } from "../resources/general-utilities.js";

/**
 * @param { import("discord.js").Message } message
*/
const messageDelete = async (message) => {
  const auditLog = await message.guild.fetchAuditLogs({ type: AuditLogEvent.MessageDelete, limit: 1 });
  const auditLogFirstEntry = auditLog.entries.first();
  const customChannel = message.guild.channels.cache.find((channel) => channel.name === customChannels.private);
  const embedMessage = new EmbedBuilder();
  const guildMemberAuthor = message.guild.members.cache.get(auditLogFirstEntry.targetId);
  const guildMemberExecutor = message.guild.members.cache.get(auditLogFirstEntry.executorId);
  
  if (guildMemberExecutor.id !== guildMemberAuthor.id && !guildMemberAuthor.user.bot) {
    const customRoleAuthor = getCustomRole(guildMemberAuthor);
    const customRoleExecutor = getCustomRole(guildMemberExecutor);

    message.client.emit("activity", guildMemberExecutor, customPoints.messageDelete.executor);
    message.client.emit("activity", guildMemberAuthor, customPoints.messageDelete.author);

    embedMessage
      .setTitle("🛡️ moderation")
      .setDescription(`${customRoleExecutor} *${guildMemberExecutor.displayName}* deleted a message in *${message.channel.name}*\n`)
      .addFields({ name: "author", value: `${customRoleAuthor} *${guildMemberAuthor}*`, inline: false })
      .addFields({ name: "content", value: `${message.content}`, inline: false })
      .addFields({ name: "promotion points", value: `${customPoints.messageDelete.author} ⭐`, inline: true })
      .addFields({ name: "to", value: `${guildMemberAuthor} ⭐`, inline: true })
      .setThumbnail(guildMemberAuthor.displayAvatarURL({ dynamic: true }))
      .setFooter({ text: `${customPoints.messageDelete.executer} ⭐ to ${guildMemberExecutor.displayName}`, iconURL: `${guildMemberExecutor.displayAvatarURL()}` })
      .setTimestamp()
      .setColor("DarkBlue");

    customChannel.send({ embeds: [embedMessage] });
  }
};

export { messageDelete };

