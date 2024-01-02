import { customChannels } from "../resources/custom-channels.js";
import { sendMesseges } from "../resources/general-utilities.js";
import { referrals } from "./ready.js";

/**
 * @param { import("discord.js").Invite } invite
 */
const inviteCreate = async (invite) => {
  const channel = invite.guild.channels.cache.find((channel) => channel.name === customChannels.public);
  let messages = [];

  messages.push(`${invite.inviter.displayName} created an invite of ${invite.maxUses} uses`);
  sendMesseges(messages, channel);
  messages = [];

  referrals[invite.code] = invite.uses;

  invite.client.emit("activity", invite.inviter, 10);
};

export { inviteCreate };