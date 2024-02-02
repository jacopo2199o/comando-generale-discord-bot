import { AuditLogEvent, EmbedBuilder } from "discord.js";
import { customChannels } from "../resources/custom-channels.js";
import { customPoints, getCalculatedPoints } from "../resources/custom-points.js";
import { getCustomRole } from "../resources/custom-roles.js";
import { reputationPoints } from "./ready.js";

/**
 * @param { import("discord.js").Message } deletedMessage
*/
const messageDelete = async (deletedMessage) => {
  const audits = await deletedMessage.guild.fetchAuditLogs({ type: AuditLogEvent.MessageDelete, limit: 1 });
  
  if (audits === undefined) {
    return console.error(audits);
  }
  
  const audit = audits.entries.first();
  
  if (audit === undefined) {
    return console.error(audit);
  }
  
  const author = deletedMessage.guild.members.cache.get(deletedMessage.author.id);
  const executor = deletedMessage.guild.members.cache.get(audit.executorId);
  console.log("controlla chi elimina il messaggio ", executor);
  
  if (author === undefined || executor === undefined) {
    return console.error(author, executor);
  }

  if (author.bot === true || executor.user.bot === true) {
    return;
  }

  if (author.id === executor.id) {
    return;
  }
  
  const content = deletedMessage.content || "n.a.";
  const authorPoints = getCalculatedPoints(customPoints.messageDelete.author, reputationPoints[author.guild.id][author.id].points);
  deletedMessage.client.emit("activity", author, authorPoints);
  const executorPoints = getCalculatedPoints(customPoints.messageDelete.executor, reputationPoints[executor.guild.id][executor.id].points);
  deletedMessage.client.emit("activity", executor, executorPoints);
  const message = new EmbedBuilder();
  message.setTitle("🛡️ moderation");
  const executorRole = getCustomRole(executor) || "n.a.";
  message.setDescription(`${executorRole} *${executor.displayName}* deleted a message in *${deletedMessage.channel.name}*`);
  const authorRole = getCustomRole(author) || "n.a.";
  message.addFields({ name: "author", value: `${authorRole} *${author}*`, inline: false });
  message.addFields({ name: "content", value: `${content}`, inline: false });
  message.addFields({ name: "promotion points", value: `${authorPoints} ⭐`, inline: true });
  message.addFields({ name: "to", value: `${author} ⭐`, inline: true });
  message.setThumbnail(author.displayAvatarURL({ dynamic: true }));
  message.setFooter({ text: `${executorPoints} ⭐ to ${executor.displayName}`, iconURL: `${executor.displayAvatarURL()}` });
  message.setTimestamp();
  message.setColor("DarkBlue");
  const channel = deletedMessage.guild.channels.cache.find((channel) => channel.name === customChannels.private)
    || deletedMessage.guild.channels.cache.get(deletedMessage.guild.publicUpdatesChannelId);
  channel.send({ embeds: [message] });
};

export { messageDelete };

