import { EmbedBuilder } from "discord.js";
import { customChannels } from "../resources/custom-channels.js";

/**
 * @param { import("discord.js").GuildMember } newMember
 * @param { import("discord.js").GuildMember } oldMember
 */
const guildMemberUpdate = async (oldMember, newMember) => {
  const customChannel = newMember.guild.channels.cache.find((channel) => channel.name === customChannels.activity);

  let embedMessage = new EmbedBuilder();

  if (oldMember.roles.cache.size > newMember.roles.cache.size) {
    oldMember.roles.cache.forEach(role => {
      if (!newMember.roles.cache.has(role.id)) {
        embedMessage
          .setDescription(`🔰 ${role} has been removed from *${newMember}*`)
          .setFooter({ text: `${newMember.displayName}`, iconURL: `${newMember.displayAvatarURL()}` })
          .setTimestamp()
          .setColor("DarkRed");
      }
    });
  } else if (oldMember.roles.cache.size < newMember.roles.cache.size) {
    newMember.roles.cache.forEach(role => {
      if (!oldMember.roles.cache.has(role.id)) {
        embedMessage
          .setDescription(`🔰 ${role} has been added to *${newMember}*`)
          .setFooter({ text: `${newMember.displayName}`, iconURL: `${newMember.displayAvatarURL()}` })
          .setTimestamp()
          .setColor("DarkGreen");
      }
    });
  }

  customChannel.send({ embeds: [embedMessage] });
};

export { guildMemberUpdate };