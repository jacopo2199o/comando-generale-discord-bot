import { customChannels } from "../resources/custom-channels.js";
import { customRoles } from "../resources/custom-roles.js";
import { sendMesseges } from "../resources/general-utilities.js";
import { activityPoints } from "./ready.js";

/**
 * @param { import("discord.js").GuildMember } guildMember
 * @param { Number } points
 */
const activityDone = async (guildMember, points) => {
  if (guildMember.id !== guildMember.guild.ownerId) {
    const channel = guildMember.guild.channels.cache.find((channel) => channel.name === customChannels.public);
    let messages = [];

    activityPoints[guildMember.id] += points;

    if (activityPoints[guildMember.id] >= 1000) {
      messages.push(`*${guildMember.displayName}* reached 1000 activity point`);
      sendMesseges(messages, channel);
      messages = [];

      guildMember.roles.cache.forEach(async (role) => {
        const rankIndex = customRoles.findIndex((rank) => rank === role.name);

        // trovata corrispondenza col nome ruolo
        if (rankIndex !== -1) {
          const oldRank = customRoles[rankIndex];
          const newRank = customRoles[rankIndex - 1];

          // l'indice 0 corrisponde al ruolo "presidente"
          if (newRank !== "presidente") {
            const oldRole = guildMember.guild.roles.cache.find((role) => role.name === oldRank);
            const newRole = guildMember.guild.roles.cache.find((role) => role.name === newRank);

            await guildMember.roles.remove(oldRole.id);
            await guildMember.roles.add(newRole.id);
          }
        }
      });

      activityPoints[guildMember.id] = 0;
    }
  }
};

export { activityDone };