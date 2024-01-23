import { EmbedBuilder } from "discord.js";
import { customChannels } from "../resources/custom-channels.js";
import { customPoints } from "../resources/custom-points.js";
import { customRoles } from "../resources/custom-roles.js";
import { saveFile } from "../resources/general-utilities.js";
import { globalPoints, reputationPoints } from "./ready.js";

/**
 * @param { import("discord.js").GuildMember } guildMember
 * @param { Number } points
 */
const activity = async (guildMember, points) => {
  const channel = guildMember.guild.channels.cache.find((channel) => channel.name === customChannels.activity)
    || guildMember.guild.channels.cache.get(guildMember.guild.publicUpdatesChannelId);
  const message = new EmbedBuilder();
  const pointsRing = (globalPoints[guildMember.guild.id][guildMember.id] % customPoints.promotionPoints) + points;

  globalPoints[guildMember.guild.id][guildMember.id] += points;

  if (pointsRing >= customPoints.promotionPoints && guildMember.id !== guildMember.guild.ownerId) {
    guildMember.roles.cache.forEach(async (role) => {
      const customRoleIndex = customRoles.findIndex((customRole) => customRole === role.name);

      if (customRoleIndex !== -1) {
        const newCustomRole = customRoles[customRoleIndex - 1];
        const oldCustomRole = customRoles[customRoleIndex];

        if (newCustomRole !== undefined && oldCustomRole !== undefined) {
          if (newCustomRole !== "presidente") {
            const newRole = guildMember.guild.roles.cache.find((role) => role.name === newCustomRole);
            const oldRole = guildMember.guild.roles.cache.find((role) => role.name === oldCustomRole);
  
            if (newRole !== undefined && oldRole !== undefined) {
              await guildMember.roles.remove(oldRole.id);
              await guildMember.roles.add(newRole.id);
  
              message
                .setTitle("🎖️ promotion")
                .setDescription(`*${guildMember}* reached ${customPoints.promotionPoints} *promotion points*`)
                .addFields({ name: "old role", value: `${oldRole}`, inline: true })
                .addFields({ name: "new role", value: `${newRole}`, inline: true })
                .setThumbnail(guildMember.displayAvatarURL({ dynamic: true }))
                .setTimestamp()
                .setColor(newRole.color);
  
              channel.send({ embeds: [message] });
            }
          }
        }
      }
    });
  } else if (pointsRing < 0 && guildMember.id !== guildMember.guild.ownerId) {
    guildMember.roles.cache.forEach(async (role) => {
      const customRoleIndex = customRoles.findIndex((rank) => rank === role.name);

      if (customRoleIndex !== -1) {
        const newCustomRole = customRoles[customRoleIndex + 1];
        const oldCustomRole = customRoles[customRoleIndex];

        if (newCustomRole !== undefined && oldCustomRole !== undefined) {
          const newRole = guildMember.guild.roles.cache.find((role) => role.name === newCustomRole);
          const oldRole = guildMember.guild.roles.cache.find((role) => role.name === oldCustomRole);

          if (newRole !== undefined && oldRole !== undefined) {
            await guildMember.roles.remove(oldRole.id);
            await guildMember.roles.add(newRole.id);
          }
        }
      }
    });
  }

  if (globalPoints[guildMember.guild.id][guildMember.id] < 0) {
    globalPoints[guildMember.guild.id][guildMember.id] = 0;
  }

  await saveFile(`./resources/database/points-${guildMember.guild.id}.json`, globalPoints[guildMember.guild.id]);
  await saveFile(`./resources/database/reputation-${guildMember.guild.id}.json`, reputationPoints[guildMember.guild.id]);
};

export { activity };

