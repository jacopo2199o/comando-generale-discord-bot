import { customPoints } from "../resources/custom-points.js";
import { customRoles } from "../resources/custom-roles.js";
import { saveFile } from "../resources/general-utilities.js";
import { globalPoints } from "./ready.js";

/**
 * @param {import("discord.js").Guild} guild
 */
const pointsDecay = async (guild, points) => {
  //const channel = guild.channels.cache.find((channel) => channel.name === customChannels.public)
  //  || guild.channels.cache.get(guild.publicUpdatesChannelId);
  //const message = new EmbedBuilder();

  for (const memberId in globalPoints[guild.id]) {
    if (globalPoints[guild.id][memberId] > 0) {
      const member = guild.members.cache.get(memberId);
      const memberNewLevel = Math.floor((globalPoints[guild.id][memberId] + points) / customPoints.promotionPoints) + 1;
      const memberOldLevel = Math.floor(globalPoints[guild.id][memberId] / customPoints.promotionPoints) + 1;

      globalPoints[guild.id][memberId] += points;

      // downgrade
      if (memberNewLevel < memberOldLevel) {
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
    }
  }

  await saveFile(
    `./resources/database/points-${guild.id}.json`,
    globalPoints[guild.id]
  );
};

export { pointsDecay };

