import { EmbedBuilder } from "discord.js";
import { customChannels } from "../resources/custom-channels.js";
import { customPoints } from "../resources/custom-points.js";
import { addCustomBaseRoles, downgrade, getCustomRole } from "../resources/custom-roles.js";
import { globalPoints } from "./ready.js";

/**
 * @param {import("discord.js").Guild} guild
 */
const pointsDecay = async (guild, points) => {
  guild.members.cache.forEach((member) => {
    if (member.user.bot === false) {
      const role = getCustomRole(member);

      if (role !== undefined) {
        const pointsRing = (globalPoints[guild.id][member.id] % customPoints.promotionPoints) + points;

        if (pointsRing < 0) {
          const level = Math.floor(globalPoints[guild.id][member.id] / customPoints.promotionPoints) + 1;

          if (level < 24) {
            if (role.name !== "membro") {
              globalPoints[guild.id][member.id] = customPoints.promotionPoints + pointsRing;
            } else {
              globalPoints[guild.id][member.id] = 0;
            }

            let downgradeResult = downgrade(member);

            if (downgradeResult !== undefined) {
              const messagePublic = new EmbedBuilder();
              messagePublic.setTitle("🔰 downgrade");
              messagePublic.setDescription(`*${member}* lost ${customPoints.promotionPoints} *promotion points*`);
              messagePublic.addFields({ name: "old role", value: `${downgradeResult.oldRole}`, inline: true });
              messagePublic.addFields({ name: "new role", value: `${downgradeResult.newRole}`, inline: true });
              messagePublic.setThumbnail(member.displayAvatarURL({ dynamic: true }));
              messagePublic.setTimestamp();
              messagePublic.setColor("DarkRed");
              const channelActivity = guild.channels.cache.find((channel) => channel.name === customChannels.activity)
                || guild.channels.cache.get(guild.publicUpdatesChannelId);
              channelActivity.send({ embeds: [messagePublic] });
            }
          } else {
            globalPoints[guild.id][member.id] = customPoints.promotionPoints + pointsRing;
          }
        } else {
          globalPoints[guild.id][member.id] += points;
        }
      } else {
        addCustomBaseRoles(member);
        console.error(`member ${member.id} has no custom roles: added base ones`);
      }
    }
  });

  const messageActivity = new EmbedBuilder();
  messageActivity.setTitle("🕯 points decay");
  messageActivity.setDescription("hourly points decay balancing");
  messageActivity.addFields({ name: "promotion points", value: `${points} ⭐`, inline: true });
  messageActivity.addFields({ name: "to", value: `${guild.roles.everyone}`, inline: true });
  messageActivity.setThumbnail(guild.client.user.displayAvatarURL({ dynamic: true }));
  messageActivity.setTimestamp();
  messageActivity.setColor("DarkRed");
  const channelPublic = guild.channels.cache.find((channel) => channel.name === customChannels.public)
    || guild.channels.cache.get(guild.publicUpdatesChannelId);
  channelPublic.send({ embeds: [messageActivity] });
};

export { pointsDecay };

