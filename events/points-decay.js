import { EmbedBuilder } from "discord.js";
import { customChannels } from "../resources/custom-channels.js";
import { customPoints } from "../resources/custom-points.js";
import { addCustomBaseRoles, downgrade, getCustomRole } from "../resources/custom-roles.js";
import { globalPoints, pointsLastMove } from "./ready.js";

/**
 * @param {import("discord.js").Guild} guild
 */
const pointsDecay = async (guild, points) =>
{
  guild.members.cache.forEach((member) =>
  {
    if (member.user.bot === false)
    {
      pointsLastMove[member.guild.id][member.id] = -1;
      const role = getCustomRole(member);
      if (role !== undefined)
      {
        const pointsRing = (globalPoints[guild.id][member.id] % customPoints.promotionPoints) + points;
        if (pointsRing < 0)
        {
          const level = Math.floor(globalPoints[guild.id][member.id] / customPoints.promotionPoints) + 1;
          if (level < 24)
          {
            if (role.name !== "membro")
            {
              if (globalPoints[guild.id][member.id] > 0)
              {
                globalPoints[guild.id][member.id] += points;
              }
              else
              {
                globalPoints[guild.id][member.id] = customPoints.promotionPoints + points;
              }
            }
            else
            {
              globalPoints[guild.id][member.id] = 0;
            }
            let downgradeResult = downgrade(member);
            if (downgradeResult !== undefined)
            {
              const message = new EmbedBuilder();
              message.setTitle("🔰 downgrade");
              message.setDescription(`*${member}* no longer have *promotion points* for ${downgradeResult.oldRole}`);
              message.addFields({ name: "old role", value: `${downgradeResult.oldRole}`, inline: true });
              message.addFields({ name: "new role", value: `${downgradeResult.newRole}`, inline: true });
              message.setThumbnail(member.displayAvatarURL({ dynamic: true }));
              message.setTimestamp();
              message.setColor("DarkRed");
              const channel = guild.channels.cache.find((channel) => channel.name === customChannels.activity)
                ?? guild.publicUpdatesChannel;
              channel.send({ embeds: [message] });
            }
          }
          else
          {
            globalPoints[guild.id][member.id] += points;
          }
        }
        else
        {
          globalPoints[guild.id][member.id] += points;
        }
      } 
      else
      {
        addCustomBaseRoles(member);
        console.error(`member ${member.displayName} has no custom roles: added base ones`);
      }
    }
  });
  const message = new EmbedBuilder();
  message.setTitle("🕯 points decay");
  message.setDescription("daily points decay balancing");
  message.addFields({ name: "promotion points", value: `${points} ⭐`, inline: true });
  message.addFields({ name: "to", value: `${guild.roles.everyone}`, inline: true });
  message.setThumbnail(guild.client.user.displayAvatarURL({ dynamic: true }));
  message.setTimestamp();
  message.setColor("DarkRed");
  const channel = guild.channels.cache.find((channel) => channel.name === customChannels.public)
    ?? guild.publicUpdatesChannel;
  channel.send({ embeds: [message] });
};

export { pointsDecay };

