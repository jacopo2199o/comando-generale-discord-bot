import { sendMesseges } from "../resources/general-utilities.js";
import { activityPoints } from "./ready.js";

/**
 * @param { import("discord.js").GuildMember } guildMember
 * @param { Number } points
 */
const activityDone = async (guildMember, points) => {
  const channel = guildMember.guild.channels.cache.find((channel) => channel.name === "🤖bot-testing");
  let messages = [];

  activityPoints[guildMember.id] += points;

  if (activityPoints[guildMember.id] === 1) {
    messages.push(`*${guildMember.displayName}* reached 100 activity point`);
    sendMesseges(messages, channel);
    messages = [];

    activityPoints[guildMember.id] = 0;
  }
};

export { activityDone };