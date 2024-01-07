import { customRoles } from "../resources/custom-roles.js";
import { sendMesseges } from "../resources/general-utilities.js";
import { promotionPoints, globalPoints } from "./ready.js";

/**
 * @param { import("discord.js").GuildMember } guildMember
 * @param { import("discord.js").Channel } channel
 * @param { Number } points
 */
const activity = async (guildMember, channel, points) => {
  let messages = [];

  promotionPoints[guildMember.id] += points;
  globalPoints[guildMember.id] += points;

  if (promotionPoints[guildMember.id] >= 1000) {
    promotionPoints[guildMember.id] = 0;

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

    messages.push(`🎖 *${guildMember.displayName}* reached 1000 activity point\n`);
    sendMesseges(messages, channel);
    messages = [];
  } else if (promotionPoints[guildMember.id] < 0) {
    promotionPoints[guildMember.id] = 1000 + points; //points in questo caso è un numero negativo

    guildMember.roles.cache.forEach(async (role) => {
      const rankIndex = customRoles.findIndex((rank) => rank === role.name);

      if (rankIndex !== -1) {
        const oldRank = customRoles[rankIndex];
        const newRank = customRoles[rankIndex + 1];

        if (newRank) {
          const oldRole = guildMember.guild.roles.cache.find((role) => role.name === oldRank);
          const newRole = guildMember.guild.roles.cache.find((role) => role.name === newRank);

          await guildMember.roles.remove(oldRole.id);
          await guildMember.roles.add(newRole.id);
        }
      }
    });
  }
};

export { activity };