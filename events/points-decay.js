import { EmbedBuilder } from "discord.js";
import { customChannels } from "../resources/custom-channels.js";
import { customPoints } from "../resources/custom-points.js";
import { downgrade } from "../resources/custom-roles.js";
import { globalPoints } from "./ready.js";

/**
 * @param {import("discord.js").Guild} guild
 */
const pointsDecay = async (guild, points) => {
  const channelPublic = guild.channels.cache.find((channel) => channel.name === customChannels.public)
    || guild.channels.cache.get(guild.publicUpdatesChannelId);
  const channelActivity = guild.channels.cache.find((channel) => channel.name === customChannels.activity)
    || guild.channels.cache.get(guild.publicUpdatesChannelId);
  const message = new EmbedBuilder();

  for (const memberId in globalPoints[guild.id]) {
    const member = guild.members.cache.get(memberId);
    const memberLevel = Math.floor(globalPoints[guild.id][memberId] / customPoints.promotionPoints) + 1;
    const pointsRing = (globalPoints[guild.id][memberId] % customPoints.promotionPoints) + points;

    let downgradeResult = undefined;

    if (pointsRing < 0) {
      if (memberLevel < 24) {
        if (memberLevel > 1) {
          globalPoints[guild.id][memberId] = customPoints.promotionPoints + pointsRing;
        } else {
          globalPoints[guild.id][memberId] = 0;
        }

        downgradeResult = downgrade(member);

        if (downgradeResult !== undefined) {
          message
            .setTitle("🔰 downgrade")
            .setDescription(`*${member}* lost ${customPoints.promotionPoints} *promotion points*`)
            .addFields({
              name: "old role",
              value: `${downgradeResult.oldRole}`,
              inline: true
            })
            .addFields({
              name: "new role",
              value: `${downgradeResult.newRole}`,
              inline: true
            })
            .setThumbnail(member.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
            .setColor("DarkRed");

          channelActivity.send({ embeds: [message] });
        }
      } else {
        globalPoints[guild.id][memberId] += points;
      }
    } else {
      globalPoints[guild.id][memberId] += points;
    }
  }

  message
    .setTitle("🕯 points decay")
    .setDescription("hourly points decay balancing")
    .addFields({
      name: "promotion points",
      value: `${points} ⭐`,
      inline: true
    })
    .addFields({
      name: "to",
      value: `${guild.roles.everyone}`,
      inline: true
    })
    .setThumbnail(guild.client.user.displayAvatarURL({ dynamic: true }))
    .setTimestamp()
    .setColor("DarkRed");

  channelPublic.send({ embeds: [message] });
};

export { pointsDecay };

