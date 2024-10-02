import {
  EmbedBuilder
} from "discord.js";
import {
  customChannels
} from "../resources/custom-channels.js";

/**
 * @param {import("discord.js").Guild} guild
 */
async function pointsDecay(
  guild,
  points
) {
  guild.members.cache.forEach(
    function (
      member
    ) {
      if (
        member.user.bot === true
      ) {
        return;
      }
      member.client.emit(
        "activity",
        member,
        points
      );
    }
  );
  const message = new EmbedBuilder();
  message.setTitle(
    "🕯 points decay"
  );
  message.setDescription(
    "daily points decay balancing"
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
      value: `${guild.roles.everyone}`,
      inline: true
    }
  );
  message.setThumbnail(
    guild.client.user.displayAvatarURL(
      {
        dynamic: true
      }
    )
  );
  message.setTimestamp();
  message.setColor(
    "DarkRed"
  );
  const channel = guild.channels.cache.find(
    function (
      channel
    ) {
      return channel.name === customChannels.public;
    }
  ) ?? guild.publicUpdatesChannel;
  channel.send(
    {
      embeds: [
        message
      ]
    }
  );
}

export {
  pointsDecay
};

