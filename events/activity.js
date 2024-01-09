import { EmbedBuilder } from "discord.js";
import { customRoles } from "../resources/custom-roles.js";
import { promotionPoints, globalPoints } from "./ready.js";
import { customChannels } from "../resources/custom-channels.js";

/**
 * @param { import("discord.js").GuildMember } guildMember
 * @param { import("discord.js").Channel } customChannel
 * @param { Number } points
 */
const activity = async (guildMember, points) => {
  const customChannel = guildMember.guild.channels.cache.find((channel) => channel.name === customChannels.welcome);

  let embedMessage = new EmbedBuilder();

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
        if (newRank !== undefined && newRank !== "presidente") {
          const oldRole = guildMember.guild.roles.cache.find((role) => role.name === oldRank);
          const newRole = guildMember.guild.roles.cache.find((role) => role.name === newRank);

          await guildMember.roles.remove(oldRole.id);
          await guildMember.roles.add(newRole.id);

          embedMessage.setDescription(`🎖 *${guildMember}* reached 1000 activity point\n`)
            .setThumbnail(guildMember.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
            .setColor(newRole.color);

          customChannel.send({ embeds: [embedMessage] });
        }
      }
    });
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