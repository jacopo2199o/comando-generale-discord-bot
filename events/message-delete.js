import { AuditLogEvent, EmbedBuilder } from "discord.js";
import { customChannels } from "../resources/custom-channels.js";
import { customPoints, getCalculatedPoints } from "../resources/custom-points.js";
import { getCustomRole } from "../resources/custom-roles.js";
import { reputationPoints } from "./ready.js";

/**
 * @param { import("discord.js").Message } message
*/
const messageDelete = async (message) => {
  const auditLog = await message.guild.fetchAuditLogs({ type: AuditLogEvent.MessageDelete, limit: 1 });
  const channel = message.guild.channels.cache.find((channel) => channel.name === customChannels.private)
    || message.guild.channels.cache.get(message.guild.publicUpdatesChannelId);
  const embedMessage = new EmbedBuilder();
  const content = message.content || "n.a.";
  const cachedMessage = message.channel.messages.cache.get(message.id);

  let author = undefined;
  let authorPoints = undefined;
  let authorRole = undefined;
  let entry = undefined;
  let executor = undefined;
  let executorPoints = undefined;
  let executorRole = undefined;

  if (auditLog !== undefined) {
    entry = auditLog.entries.first();

    console.log("fix this entry author ", cachedMessage);

    if (entry !== undefined) {
      author = message.guild.members.cache.get(entry.targetId);
      executor = message.guild.members.cache.get(entry.executorId);

      if (author !== undefined && author.user.bot !== false) {
        authorRole = getCustomRole(author);
        authorPoints = getCalculatedPoints(customPoints.messageDelete.author, reputationPoints[author.guild.id][author.id].points);
      } else {
        return;
      }

      if (executor !== undefined && executor.user.bot !== false) {
        executorRole = getCustomRole(executor);
        executorPoints = getCalculatedPoints(
          customPoints.messageDelete.executor,
          reputationPoints[executor.guild.id][executor.id].points
        );
      } else {
        return;
      }
    }
  } else {
    return;
  }

  if (executor.id !== author.id && author.user.bot === false) {
    message.client.emit("activity", author, authorPoints);
    message.client.emit("activity", executor, executorPoints);

    embedMessage
      .setTitle("🛡️ moderation")
      .setDescription(`${executorRole} *${executor.displayName}* deleted a message in *${message.channel.name}*\n`)
      .addFields({ name: "author", value: `${authorRole} *${author}*`, inline: false })
      .addFields({ name: "content", value: `${content}`, inline: false })
      .addFields({ name: "promotion points", value: `${authorPoints} ⭐`, inline: true })
      .addFields({ name: "to", value: `${author} ⭐`, inline: true })
      .setThumbnail(author.displayAvatarURL({ dynamic: true }))
      .setFooter({ text: `${executorPoints} ⭐ to ${executor.displayName}`, iconURL: `${executor.displayAvatarURL()}` })
      .setTimestamp()
      .setColor("DarkBlue");

    channel.send({ embeds: [embedMessage] });
  }
};

export { messageDelete };

