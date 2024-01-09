import { EmbedBuilder } from "discord.js";
import { customChannels } from "../resources/custom-channels.js";
import { customRoles } from "../resources/custom-roles.js";
import { referrals } from "./ready.js";

/**
 * @param { import("discord.js").Invite } invite
 */
const inviteCreate = async (invite) => {
  const customChannel = invite.guild.channels.cache.find((channel) => channel.name === customChannels.welcome);
  const guildMember = invite.guild.members.cache.find((member) => member.id === invite.inviter.id);

  let customRoleColor = undefined;
  let customRole = undefined;

  guildMember.roles.cache.forEach((role) => {
    const rankIndex = customRoles.findIndex((rank) => rank === role.name);

    if (rankIndex !== -1) {
      customRoleColor = role.color;
      customRole = role;
    }
  });

  referrals[invite.code] = invite.uses;

  invite.client.emit("activity", guildMember, 2);

  const embedMessage = new EmbedBuilder()
    .setDescription(`🔗 ${customRole} *${guildMember}* created an invite`)
    .addFields({ name: "promotion points", value: "+2", inline: true })
    .setThumbnail(guildMember.user.displayAvatarURL({ dynamic: true }))
    .setTimestamp()
    .setColor(customRoleColor);

  customChannel.send({ embeds: [embedMessage] });
};

export { inviteCreate };