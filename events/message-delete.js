import { AuditLogEvent, EmbedBuilder } from "discord.js";
import { customChannels } from "../resources/custom-channels.js";
import { getCustomRole } from "../resources/general-utilities.js";
import { customPoints } from "../resources/custom-points.js";

/**
 * @param { import("discord.js").Message } message
*/
const messageDelete = async (message) => {
  const auditLog = await message.guild.fetchAuditLogs({ type: AuditLogEvent.MessageDelete, limit: 1, });
  const auditLogFirstEntry = auditLog.entries.first();
  
  if (auditLogFirstEntry.target) {
    const customChannel = message.guild.channels.cache.find((channel) => channel.name === customChannels.private);
    const guildMemberAuthor = message.guild.members.cache.find((member) => member.id === message.author.id);
    const guildMemberExecutor = message.guild.members.cache.find((member) => member.id === auditLogFirstEntry.executorId);
    const messageContent = message.content || "n.a.";
    
    let embedMessage = new EmbedBuilder();

    if (guildMemberExecutor.id !== guildMemberAuthor.id) {
      const customRoleExecutor = getCustomRole(guildMemberExecutor.executor);
      const customRoleAuthor = getCustomRole(guildMemberAuthor);
  
      message.client.emit("activity", guildMemberExecutor, customPoints.messageDelete.executer);
      message.client.emit("activity", guildMemberAuthor, customPoints.messageDelete.author);
  
      embedMessage
        .setTitle("🛡️ moderation")
        .setDescription(`${customRoleExecutor} *${guildMemberExecutor}* deleted a message in *${message.channel}*\n`)
        .addFields({ name: "author", value: `${customRoleAuthor} *${guildMemberAuthor}*`, inline: false })
        .addFields({ name: "content", value: `${messageContent}`, inline: false })
        .addFields({ name: "promotion points", value: `-${customPoints.messageDelete.author} ⭐`, inline: false })
        .setThumbnail(guildMemberAuthor.displayAvatarURL({ dynamic: true }))
        .setFooter({ text: `+${customPoints.messageDelete.executer} ⭐ to ${guildMemberExecutor.displayName}`, iconURL: `${guildMemberExecutor.displayAvatarURL()}` })
        .setTimestamp()
        .setColor(customRoleExecutor.color);
  
      customChannel.send({ embeds: [embedMessage] });
    }
  }
};

export { messageDelete };