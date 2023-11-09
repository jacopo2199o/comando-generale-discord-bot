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
  communities.get(member.guild.id)
    .activity.addProfile(member);
};

export {
  name,
  execute
};