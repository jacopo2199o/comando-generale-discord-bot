import { customChannels } from "../resources/custom-channels.js";
import { sendMesseges } from "../resources/general-utilities.js";
import { referrals } from "./ready.js";

/**
 * @param { import("discord.js").Invite } invite
 */
const inviteCreate = async (invite) => {
  const channel = invite.guild.channels.cache.find((channel) => channel.name === customChannels.public);
  const guildMember = invite.guild.members.cache.find((member) => member.id === invite.inviter.id);

  let messages = [];

  referrals[invite.code] = invite.uses;

  invite.client.emit("activity", guildMember, channel, 1);

  messages.push(`🔗 *${invite.inviter.displayName}* created an invite`);
  sendMesseges(messages, channel);
  messages = [];
};

export { inviteCreate };