import { sendMesseges } from "../resources/general-utilities.js";
import { activityPoints } from "./ready.js";

/**
 * @param { import("discord.js").GuildMember } guildMember
 */
const guildMemberRemove = async (guildMember) => {
  const channel = guildMember.guild.channels.cache.find((channel) => channel.name === "🤖bot-testing");
  let messages = [];

  messages.push(`*${guildMember.displayName}* left *comando generale*`);
  sendMesseges(messages, channel);
  messages = [];

  delete activityPoints[guildMember.id];  
};

export { guildMemberRemove };