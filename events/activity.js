import { EmbedBuilder } from "discord.js";
import { customChannels } from "../resources/custom-channels.js";
import { customPoints } from "../resources/custom-points.js";
import { customRoles } from "../resources/custom-roles.js";
import { saveFile } from "../resources/general-utilities.js";
import { globalPoints, reputationPoints } from "./ready.js";

/**
 * @param { import("discord.js").GuildMember } member
 * @param { Number } points
 */
const activity = async (member, points) => {
  const channel = member.guild.channels.cache.find((channel) => channel.name === customChannels.activity)
    || member.guild.channels.cache.get(member.guild.publicUpdatesChannelId);
  const memberlevel = Math.floor(globalPoints[member.guild.id][member.id] / customPoints.promotionPoints) + 1;
  const message = new EmbedBuilder();
  const pointsRing = (globalPoints[member.guild.id][member.id] % customPoints.promotionPoints) + points;

  globalPoints[member.guild.id][member.id] += points;

  if (member.id === member.guild.ownerId) return;

  if (pointsRing >= customPoints.promotionPoints) {
    member.roles.cache.forEach(
      async (role) => {
        const customRoleIndex = customRoles.findIndex((customRole) => customRole === role.name);

        if (customRoleIndex !== -1) {
          const newRoleName = customRoles[customRoleIndex - 1];
          const oldRoleName = customRoles[customRoleIndex];

          if (newRoleName !== undefined && oldRoleName !== undefined) {
            if (newRoleName !== "presidente") {
              const newRole = member.guild.roles.cache.find((role) => role.name === newRoleName);
              const oldRole = member.guild.roles.cache.find((role) => role.name === oldRoleName);

              if (newRole !== undefined && oldRole !== undefined) {
                await member.roles.remove(oldRole.id);
                await member.roles.add(newRole.id);

                message
                  .setTitle("🎖️ promotion")
                  .setDescription(`*${member}* reached ${customPoints.promotionPoints} *promotion points*`)
                  .addFields({
                    name: "old role",
                    value: `${oldRole}`,
                    inline: true
                  })
                  .addFields({
                    name: "new role",
                    value: `${newRole}`,
                    inline: true
                  })
                  .setThumbnail(member.displayAvatarURL({ dynamic: true }))
                  .setTimestamp()
                  .setColor(newRole.color);

                channel.send({ embeds: [message] });
              }
            }
          }
        }
      }
    );
  } else if (pointsRing < 0 && memberlevel < 24) {
    member.roles.cache.forEach(
      async (role) => {
        const customRoleIndex = customRoles.findIndex((rank) => rank === role.name);

        if (customRoleIndex !== -1) {
          const newRoleName = customRoles[customRoleIndex + 1];
          const oldRoleName = customRoles[customRoleIndex];

          if (newRoleName !== undefined && oldRoleName !== undefined) {
            const newRole = member.guild.roles.cache.find((role) => role.name === newRoleName);
            const oldRole = member.guild.roles.cache.find((role) => role.name === oldRoleName);

            if (newRole !== undefined && oldRole !== undefined) {
              await member.roles.remove(oldRole.id);
              await member.roles.add(newRole.id);
            }
          }
        }
      }
    );
  }

  if (globalPoints[member.guild.id][member.id] < 0) {
    globalPoints[member.guild.id][member.id] = 0;
  }

  await saveFile(
    `./resources/database/points-${member.guild.id}.json`,
    globalPoints[member.guild.id]
  );
  await saveFile(
    `./resources/database/reputation-${member.guild.id}.json`,
    reputationPoints[member.guild.id]
  );
};

export { activity };

