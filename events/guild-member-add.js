import dotenv from "dotenv";
import { Events } from "discord.js";
import { community } from "./ready.js";

dotenv.config();

const name = Events.GuildMemberAdd;
/**
 * @param {import("discord.js").GuildMember} member
 */
const execute = async (member) => {
  if (community.id === process.env.comando_generale_id) {
    member.roles.add("1008665802716741733"); // membro
  } else if (community.id === process.env.jacopo2199o_id) {    
    member.roles.add("1137407767368433715"); // ruolo giallo
  }

  // da fare: aggiungere il canale di base dinamico in base al server
  await member.guild.channels.cache.get("1100786695613456455")
    .send(`Hello ${member.displayName}`);
};

export {
  name,
  execute
};