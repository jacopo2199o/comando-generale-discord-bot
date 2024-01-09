import { EmbedBuilder } from "discord.js";
import { customChannels } from "../resources/custom-channels.js";

/**
 * @param { import("discord.js").GuildMember } newMember
 * @param { import("discord.js").GuildMember } oldMember
 */
const guildMemberUpdate = async (oldMember, newMember) => {
  const customChannel = newMember.guild.channels.cache.find((channel) => channel.name === customChannels.internal);

  let embedMessage = new EmbedBuilder();

  if (oldMember.roles.cache.size > newMember.roles.cache.size) {
    oldMember.roles.cache.forEach(role => {
      if (!newMember.roles.cache.has(role.id)) {
        embedMessage
          .setTitle("🔰 role")
          .setDescription(`🔰 *${role}* has been removed from *${newMember}*\n`)
          .setThumbnail(newMember.displayAvatarURL({ dynamic: true }))
          .setTimestamp()
          .setColor(role.color);
      }
    });
  } else if (oldMember.roles.cache.size < newMember.roles.cache.size) {
    newMember.roles.cache.forEach(role => {
      if (!oldMember.roles.cache.has(role.id)) {
        embedMessage
          .setTitle("🔰 role")
          .setDescription(`🔰 *${role}* has been added to *${newMember}*\n`)
          .setThumbnail(newMember.displayAvatarURL({ dynamic: true }))
          .setTimestamp()
          .setColor(role.color);
      }
    });
  }

  customChannel.send({ embeds: [embedMessage] });
};

export { guildMemberUpdate };