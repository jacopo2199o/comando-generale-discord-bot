import { EmbedBuilder } from "discord.js";
import { customChannels } from "../resources/custom-channels.js";
import { getCustomRole } from "../resources/custom-roles.js";

/**
 * @param { import("discord.js").GuildMember } newMember
 * @param { import("discord.js").GuildMember } oldMember
 */
const guildMemberUpdate = async (oldMember, newMember) => {
  const channel = newMember.guild.channels.cache.find((channel) => channel.name === customChannels.activity)
    ?? newMember.guild.channels.cache.get(newMember.guild.publicUpdatesChannelId);

  if (oldMember.roles.cache.size > newMember.roles.cache.size) {
    oldMember.roles.cache.forEach(role => {
      if (!newMember.roles.cache.has(role.id)) {
        const message = new EmbedBuilder();
        message.setDescription(`🔰 ${role} has been removed from *${newMember}*`);
        message.setFooter({ text: `${newMember.displayName}`, iconURL: `${newMember.displayAvatarURL()}` });
        message.setTimestamp();
        message.setColor("DarkRed");
        channel.send({ embeds: [message] });
      }
    });
  } else if (oldMember.roles.cache.size < newMember.roles.cache.size) {
    newMember.roles.cache.forEach(role => {
      if (!oldMember.roles.cache.has(role.id)) {
        const message = new EmbedBuilder();
        message.setDescription(`🔰 ${role} has been added to *${newMember}*`);
        message.setFooter({ text: `${newMember.displayName}`, iconURL: `${newMember.displayAvatarURL()}` });
        message.setTimestamp();
        message.setColor("DarkGreen");
        channel.send({ embeds: [message] });
      }
    });
  } else if (oldMember.nickname !== newMember.nickname) {
    const role = getCustomRole(newMember);
    
    if (role === undefined) {
      return console.error(role);
    }

    const message = new EmbedBuilder();
    message.setTitle("🪪 new nickname");
    message.setDescription(`${role} *${oldMember}* changed his nickname in ${newMember}`);
    message.setThumbnail(newMember.displayAvatarURL({ dynamic: true }));
    message.setTimestamp();
    message.setColor(role.color);
    channel.send({ embeds: [message] });
  }
};

export { guildMemberUpdate };

