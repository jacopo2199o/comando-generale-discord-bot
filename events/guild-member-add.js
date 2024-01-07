import { customChannels } from "../resources/custom-channels.js";
import { sendMesseges } from "../resources/general-utilities.js";
import { promotionPoints, globalPoints, referrals } from "./ready.js";

/**
 * @param { import("discord.js").GuildMember } guildMember
 */
const guildMemberAdd = async (guildMember) => {
  const guildInvites = await guildMember.guild.invites.fetch();
  const channelPublic = guildMember.guild.channels.cache.find((channel) => channel.name === customChannels.public);
  const channelWelcome = guildMember.guild.channels.cache.find((channel) => channel.name === customChannels.welcome);

  let messages = [];

  promotionPoints[guildMember.id] = 0;
  globalPoints[guildMember.id] = 0;

  guildInvites.forEach((guildInvite) => {
    if (guildInvite.uses !== referrals[guildInvite.code]) {
      const inviter = guildInvite.guild.members.cache.find((member) => member.id === guildInvite.inviter.id);
      referrals[guildInvite.code] = guildInvite.uses;
      
      guildMember.client.emit("activity", inviter, channelPublic, 1000);
      
      messages.push(`🌱 welcome, *${guildMember}, benvenuto al *comando generale*\ninviter: *${guildInvite.inviter}*\n`);
      sendMesseges(messages, channelWelcome);
      messages = [];
    }
  });
  
  messages.push(`🌱 *${guildMember.displayName}* joined *comando generale*\n`);
  sendMesseges(messages, channelPublic);
  messages = [];
};

export { guildMemberAdd };