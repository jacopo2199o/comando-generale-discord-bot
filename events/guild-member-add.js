import dotenv from "dotenv";
import { Events } from "discord.js";
import { community } from "./ready.js";
import { activity } from "../commands/start-activity-points.js";

dotenv.config();

const name = Events.GuildMemberAdd;
/**
 * @param {import("discord.js").GuildMember} member
 */
const execute = async (member) => {
  if (member.guild.id === community.id) {
    if (!member.roles.cache.has(community.baseRole.id)) {
      member.roles.add(community.baseRole.id);
    }

    activity.addProfile(member, community.baseRole);
    // per sicurezza, assegna il ruolo base per iniziare
    await member.guild.channels.cache.get(community.room)
      .send(`welcome there, ${member.displayName}`);
  }
};

export {
  name,
  execute
};