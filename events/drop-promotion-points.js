import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder
} from "discord.js";
import {
  customChannels
} from "../resources/custom-channels.js";
import {
  drops
} from "../resources/custom-points.js";
import {
  generalSettings
} from "../resources/general-settings.js";

/**
 * @param {import("discord.js").Channel} dropChannel
 */
async function dropPromotionPoints(
  dropChannel
) {
  const button = new ButtonBuilder().setCustomId(
    "takePromotionPoints"
  ).setLabel(
    "take"
  ).setStyle(
    ButtonStyle.Success
  );
  const actionRow = new ActionRowBuilder().addComponents(
    button
  );
  const dropMessage = new EmbedBuilder().setTitle(
    "📦 new drop"
  ).setDescription(
    "based on messages sent globally in this server. take it pressing the green button below" +
    "(expires in " + generalSettings.promotionPointsMessageExpiration + " seconds)"
  ).addFields(
    {
      name: "type",
      value: "promotion points",
      inline: true
    }
  ).addFields(
    {
      name: "value",
      value: `${drops.promotionPoints} ⭐`,
      inline: true
    }
  ).setThumbnail(
    dropChannel.client.user.displayAvatarURL(
      {
        dynamic: true
      }
    )
  ).setFooter(
    {
      text: "*use __/view-promotion-points__ to see yours*"
    }
  ).setTimestamp().setColor(
    "DarkGreen"
  );
  const publicMessage = new EmbedBuilder().setTitle(
    "📦 new drop"
  ).setDescription(
    `a *promotion points* drop spawned in *${dropChannel.name}*`
  ).addFields(
    {
      name: "type",
      value: "promotion points",
      inline: true
    }
  ).addFields(
    {
      name: "value",
      value: `${drops.promotionPoints} ⭐`,
      inline: true
    }
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
      ],
      components: [
        actionRow
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
  dropPromotionPoints
};

