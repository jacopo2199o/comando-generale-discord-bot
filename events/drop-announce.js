import {
  EmbedBuilder
} from "discord.js";
import {
  customChannels
} from "../resources/custom-channels.js";
import {
  generalSettings
} from "../resources/general-settings.js";

/**
 * @param {import("discord.js").Channel} dropChannel
 */
async function dropAnnounce(
  dropChannel
) {
  const dropMessage = new EmbedBuilder().setTitle(
    "☕ announce"
  ).setDescription(
    "*comando generale* released a *mini-map game* to play togheter and earn extra *promotion points* everyday, " +
    "give it a try!\nhow to play in <#1070638455769550848>"
  ).setThumbnail(
    dropChannel.client.user.displayAvatarURL(
      {
        dynamic: true
      }
    )
  ).setFooter(
    {
      text: "*write */mg-* to see related commands*"
    }
  ).setTimestamp().setColor(
    "DarkGreen"
  );
  const publicMessage = new EmbedBuilder().setTitle(
    "☕ new announce"
  ).setDescription(
    `an *announce* spawned in *${dropChannel.name}*`
  ).setThumbnail(
    dropChannel.client.user.displayAvatarURL(
      {
        dynamic: true
      }
    )
  ).setTimestamp().setColor(
    "DarkGreen"
  );
  const publicChannel = dropChannel.guild.channels.cache.find(
    function (
      channel
    ) {
      return channel.name === customChannels.public;
    }
  ) ?? dropChannel.guild.publicUpdatesChannel;
  await publicChannel.send(
    {
      embeds: [
        publicMessage
      ]
    }
  );
  const dropMessageSent = await dropChannel.send(
    {
      embeds: [
        dropMessage
      ]
    }
  );
  setTimeout(
    function () {
      dropMessageSent.delete();
    },
    generalSettings.promotionPointsMessageExpiration
  );
}

export {
  dropAnnounce
};