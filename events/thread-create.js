import {
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
 * @param { import("discord.js").ThreadChannel } thread
 * @param { Boolean } newlyCreated
 */
async function threadCreate(
  thread,
  newlyCreated
) {
  if (
    newlyCreated === false
  ) {
    return;
  }
  const maker = thread.guild.members.cache.get(
    thread.ownerId
  );
  if (
    maker === undefined
  ) {
    return console.error(
      "thread create: maker undefined"
    );
  }
  const points = getCalculatedPoints(
    customPoints.threadCreate,
    reputationPoints[maker.guild.id][maker.id].points
  );
  const role = getCustomRole(
    maker
  );
  const message = new EmbedBuilder();
  message.setTitle(
    "🧵 new thread"
  );
  message.setDescription(
    `${role} *${maker}* created *${thread.name}* thread in *${thread.parent.name}*`
  );
  message.addFields(
    {
      name: "promotion points",
      value: `${points} ⭐`,
      inline: true
    }
  );
  message.addFields(
    {
      name: "to",
      value: `${maker}`,
      inline: true
    }
  );
  message.setThumbnail(
    maker.displayAvatarURL(
      {
        dynamic: true
      }
    )
  );
  message.setTimestamp();
  message.setColor(
    role.color
  );
  const channel = thread.guild.channels.cache.find(
    function (
      channel
    ) {
      return channel.name === customChannels.public;
    }
  ) ?? thread.guild.publicUpdatesChannel;
  channel.send(
    {
      embeds: [
        message
      ]
    }
  );
  thread.client.emit(
    "activity",
    maker,
    points
  );
}

export {
  threadCreate
};

