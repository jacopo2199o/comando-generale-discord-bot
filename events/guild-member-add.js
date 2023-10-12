import dotenv from "dotenv";
import { Events } from "discord.js";
import { community } from "./ready.js";
import { activity } from "../commands/start-activity-points.js";

dotenv.config();

const name = Events.GuildMemberAdd;
/**
 * @param {import("discord.js").GuildMember} guildMember
 */
const execute = async (guildMember) => {

  const baseRoleId = (() => {
    if (community.id === process.env.comando_generale_id) {
      return "1008665802716741733";
    } else if (community.id === process.env.jacopo2199o_id) {
      return "1137407767368433715";
    }
  })();

  if (!guildMember.roles.cache.has(baseRoleId)) {
    guildMember.roles.add(baseRoleId);
  }

  activity.addProfile();

  // per sicurezza, assegna il ruolo base per iniziare
  await guildMember.guild.channels.cache.get(community.room)
    .send(`Hello ${guildMember.displayName}`);
};

export {
  name,
  execute
};