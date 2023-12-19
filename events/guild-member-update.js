import { sendMesseges } from "../resources/general-utilities.js";
import { communities } from "./ready.js";
/**
 * @param { import("discord.js").GuildMember } oldMember
 * @param { import("discord.js").GuildMember } newMember
 */
const roleUpdate = async (oldMember, newMember) => {
  /**
  * @type { import("../community.js").Community }
  */
  const community = communities.get(newMember.guild.id);
  const messages = [];

  // role has been removed
  if (oldMember.roles.cache.size > newMember.roles.cache.size) {
    oldMember.roles.cache.forEach(role => {
      if (!newMember.roles.cache.has(role.id)) {
        messages.push(`*${role}* has been removed from *${newMember}*\n`);
      }
    });
  // role was added
  } else if (oldMember.roles.cache.size < newMember.roles.cache.size) {
    newMember.roles.cache.forEach(role => {
      if (!oldMember.roles.cache.has(role.id)) {
        messages.push(`*${role}* has been added to *${newMember}*\n`);
      }
    });
  }

  sendMesseges(community, messages);
};

export { roleUpdate };