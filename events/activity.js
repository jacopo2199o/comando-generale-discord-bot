import { EmbedBuilder } from "discord.js";
import { customChannels } from "../resources/custom-channels.js";
import { customPoints } from "../resources/custom-points.js";
import { customRoles } from "../resources/custom-roles.js";
import { globalPoints } from "./ready.js";

/**
 * @param { import("discord.js").GuildMember } guildMember
 * @param { import("discord.js").Channel } customChannel
 * @param { Number } points
 */
const activity = async (guildMember, points) => {
  const customChannel = guildMember.guild.channels.cache.find((channel) => channel.name === customChannels.welcome);

  let embedMessage = new EmbedBuilder();

  globalPoints[guildMember.guild.id][guildMember.id].pp += points;
  globalPoints[guildMember.guild.id][guildMember.id].g += points;

  if (globalPoints[guildMember.guild.id][guildMember.id].pp  >= customPoints.promotionPoints) {
    globalPoints[guildMember.guild.id][guildMember.id].pp  = 0;

    guildMember.roles.cache.forEach(async (role) => {
      const customRoleIndex = customRoles.findIndex((rank) => rank === role.name);

      if (customRoleIndex !== -1) {
        const oldCustomRole = customRoles[customRoleIndex];
        const newCustomRole = customRoles[customRoleIndex - 1];

        if (newCustomRole !== undefined && newCustomRole !== "presidente") {
          const oldRole = guildMember.guild.roles.cache.find((role) => role.name === oldCustomRole);
          const newRole = guildMember.guild.roles.cache.find((role) => role.name === newCustomRole);

          await guildMember.roles.remove(oldRole.id);
          await guildMember.roles.add(newRole.id);

          embedMessage
            .setTitle("🎖️ promotion")
            .setDescription(`*${guildMember}* reached ${customPoints.promotionPoints} *promotion points*\n`)
            .setThumbnail(guildMember.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
            .setColor(newRole.color);

          customChannel.send({ embeds: [embedMessage] });
        }
      }
    });
  } else if (globalPoints[guildMember.guild.id][guildMember.id].pp  < 0 && guildMember.id !== guildMember.guild.ownerId) {
    globalPoints[guildMember.guild.id][guildMember.id].pp  = customPoints.promotionPoints + points;

    guildMember.roles.cache.forEach(async (role) => {
      const customRoleIndex = customRoles.findIndex((rank) => rank === role.name);

      if (customRoleIndex !== -1) {
        const oldCustomRole = customRoles[customRoleIndex];
        const newCustomRole = customRoles[customRoleIndex + 1];

        if (newCustomRole) {
          const oldRole = guildMember.guild.roles.cache.find((role) => role.name === oldCustomRole);
          const newRole = guildMember.guild.roles.cache.find((role) => role.name === newCustomRole);

          await guildMember.roles.remove(oldRole.id);
          await guildMember.roles.add(newRole.id);
        }
      }
    });
  }
};

export { activity };
