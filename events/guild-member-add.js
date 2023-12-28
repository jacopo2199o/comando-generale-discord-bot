import { sendMesseges } from "../resources/general-utilities.js";
import { activityPoints, referrals } from "./ready.js";

/**
 * @param { import("discord.js").GuildMember } guildMember
 */
const guildMemberAdd = async (guildMember) => {
  const channel = guildMember.guild.channels.cache.find((channel) => channel.name === "🤖bot-testing");
  const guildInvites = await guildMember.guild.invites.fetch();
  let messages = [];

  guildInvites.forEach((guildInvite) => {
    if (guildInvite.uses != referrals[guildInvite.code]) {
      referrals[guildInvite.code] = guildInvite.uses;
      messages.push(`welcome *${guildMember.displayName}*\n inviter: *${guildInvite.inviter.displayName}*`);     
      sendMesseges(messages, channel);
      messages = [];
    }
  });

  activityPoints[guildMember.id] = 0;
};

export { guildMemberAdd };