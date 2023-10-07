import dotenv from "dotenv";
import { Events } from "discord.js";
import { community } from "./ready.js";

dotenv.config();

const name = Events.GuildMemberAdd;
/**
 * @param {import("discord.js").GuildMember} member
 */
const execute = async (member) => {

  const baseRole = (() => {
    if (community.id === process.env.comando_generale_id) {
      return "1008665802716741733";
    } else if (community.id === process.env.jacopo2199o_id) {
      return "1137407767368433715";
    }
  })();

  if (!member.roles.cache.has(baseRole)) {
    member.roles.add(baseRole); // membro
  }

  // per sicurezza, assegna il ruolo base per iniziare
  await member.guild.channels.cache.get(community.room)
    .send(`Hello ${member.displayName}`);
};

export {
  name,
  execute
};