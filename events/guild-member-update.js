import { customChannels } from "../resources/custom-channels.js";
import { sendMesseges } from "../resources/general-utilities.js";

/**
 * @param { import("discord.js").GuildMember } oldMember
 * @param { import("discord.js").GuildMember } newMember
 */
const guildMemberUpdate = async (oldMember, newMember) => {
  const channel = newMember.guild.channels.cache.find((channel) => channel.name === customChannels.public);
  let messages = [];

  if (oldMember.roles.cache.size > newMember.roles.cache.size) {
    oldMember.roles.cache.forEach(role => {
      if (!newMember.roles.cache.has(role.id)) {
        messages.push(`*${role.name}* has been removed from *${newMember.displayName}*\n`);
      }
    });
  } else if (oldMember.roles.cache.size < newMember.roles.cache.size) {
    newMember.roles.cache.forEach(role => {
      if (!oldMember.roles.cache.has(role.id)) {
        messages.push(`*${role.name}* has been added to *${newMember.displayName}*\n`);
      }
    });
  }

  sendMesseges(messages, channel);
  messages = [];
};

export { guildMemberUpdate };