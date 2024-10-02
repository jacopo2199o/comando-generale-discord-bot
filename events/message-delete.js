import {
  AuditLogEvent,
  EmbedBuilder
} from "discord.js";
import {
  customChannels
} from "../resources/custom-channels.js";
import {
  customPoints,
  getCalculatedPoints
} from "../resources/custom-points.js";
import {
  getCustomRole
} from "../resources/custom-roles.js";
import {
  reputationPoints
} from "./ready.js";

/**
 * @param { import("discord.js").Message } deletedMessage
*/
async function messageDelete(
  deletedMessage
) {
  const audits = await deletedMessage.guild.fetchAuditLogs(
    {
      type: AuditLogEvent.MessageDelete,
      limit: 1
    }
  );
  if (
    audits === undefined
  ) {
    return console.error(
      "message delete: audits undefined"
    );
  }
  const audit = audits.entries.first();
  if (
    audit === undefined
  ) {
    return console.error(
      "message delete: audit undefined"
    );
  }
  const author = deletedMessage.guild.members.cache.get(
    deletedMessage.author?.id
  );
  if (
    author === undefined
  ) {
    return console.error(
      "message delete: author undefined"
    );
  }
  const executor = deletedMessage.guild.members.cache.get(
    audit.executor?.id
  );
  if (
    executor === undefined
  ) {
    return console.error(
      "message delete: executor undefined"
    );
  }
  if (
    author.id === executor.id ||
    executor.id === deletedMessage.guild.ownerId
  ) {
    return;
  }
  if (
    author.user.bot === true ||
    executor.user.bot === true
  ) {
    return;
  }
  const authorPoints = getCalculatedPoints(
    customPoints.messageDelete.author,
    reputationPoints[author.guild.id][author.id].points
  );
  deletedMessage.client.emit(
    "activity",
    author,
    authorPoints
  );
  const executorPoints = getCalculatedPoints(
    customPoints.messageDelete.executor,
    reputationPoints[author.guild.id][executor.id].points
  );
  deletedMessage.client.emit(
    "activity",
    executor,
    executorPoints
  );
  const content = deletedMessage.content ?? "n.a.";
  const message = new EmbedBuilder();
  message.setTitle(
    "🛡️ moderation"
  );
  const executorRole = getCustomRole(
    executor
  ) ?? "n.a.";
  message.setDescription(
    `${executorRole} *${executor.displayName}* deleted a message in *${deletedMessage.channel.name}*`
  );
  const authorRole = getCustomRole(
    author
  ) ?? "n.a.";
  message.addFields(
    {
      name: "author",
      value: `${authorRole} *${author}*`,
      inline: false
    }
  );
  message.addFields(
    {
      name: "content",
      value: `${content}`,
      inline: false
    }
  );
  message.addFields(
    {
      name: "promotion points",
      value: `${authorPoints} ⭐`,
      inline: true
    }
  );
  message.addFields(
    {
      name: "to",
      value: `${author} ⭐`,
      inline: true
    }
  );
  message.setThumbnail(
    author.displayAvatarURL(
      {
        dynamic: true
      }
    )
  );
  message.setFooter(
    {
      text: `${executorPoints} ⭐ to ${executor.displayName}`,
      iconURL: `${executor.displayAvatarURL()}`
    }
  );
  message.setTimestamp();
  message.setColor(
    "DarkBlue"
  );
  const channel = deletedMessage.guild.channels.cache.find(
    function (
      channel
    ) {
      return channel.name === customChannels.private;
    }
  ) ?? deletedMessage.guild.publicUpdatesChannel;
  channel.send(
    {
      embeds: [
        message
      ]
    }
  );
}

export {
  messageDelete
};