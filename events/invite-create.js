import { referrals } from "./ready.js";

/**
 * @param { import("discord.js").Invite } invite
 */
const inviteCreate = async (invite) => {
  referrals[invite.code] = invite.uses;
  console.log(referrals);
  console.log("event fired " + invite.inviter.displayName);
};

export { inviteCreate };