import dotenv from "dotenv";
import { Events } from "discord.js";
import { communities } from "./ready.js";

dotenv.config();

const name = Events.GuildMemberAdd;
/**
 * @param {import("discord.js").GuildMember} member
 */
const execute = async (member) => {
  /**
   * @type { import("../community.js").Community }
   */
  const community = communities.get(member.guild.id);

  if (!member.roles.cache.has(community.settings.preferences.baseRoleId)) {
    member.roles.add(community.settings.preferences.baseRoleId);
  }

  community.activity.addProfile(member, community.settings.preferences.baseRoleId);
  await member.guild.channels.cache.get(community.settings.preferences.logRoom)
    .send(`welcome there, ${member.displayName}`);
};

export {
  name,
  execute
};