import { EmbedBuilder } from "discord.js";
import { customChannels } from "../resources/custom-channels.js";
import { getCustomRole } from "../resources/general-utilities.js";

/**
 * @param { import("discord.js").GuildMember } newMember
 * @param { import("discord.js").GuildMember } oldMember
 */
const guildMemberUpdate = async (oldMember, newMember) => {
  const channel = newMember.guild.channels.cache.find((channel) => channel.name === customChannels.activity)
    || newMember.guild.channels.cache.get(newMember.guild.publicUpdatesChannelId);
  const embedMessage = new EmbedBuilder();

  if (oldMember.roles.cache.size > newMember.roles.cache.size) {
    oldMember.roles.cache.forEach(role => {
      if (!newMember.roles.cache.has(role.id)) {
        embedMessage
          .setDescription(`🔰 ${role} has been removed from *${newMember}*`)
          .setFooter({ text: `${newMember.displayName}`, iconURL: `${newMember.displayAvatarURL()}` })
          .setTimestamp()
          .setColor("DarkRed");

        channel.send({ embeds: [embedMessage] });
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

        channel.send({ embeds: [embedMessage] });
      }
    });
  } else if (oldMember.nickname !== newMember.nickname) {
    const makerRole = getCustomRole(newMember);

    embedMessage
      .setTitle("🪪 new nickname")
      .setDescription(`${makerRole} *${oldMember}* changed his nickname in ${newMember}`)
      .setThumbnail(newMember.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(makerRole.color);

    channel.send({ embeds: [embedMessage] });
  }
};

export { guildMemberUpdate };

