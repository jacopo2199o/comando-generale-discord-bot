import { EmbedBuilder } from "discord.js";
import { customChannels } from "../resources/custom-channels.js";
import { promotionPoints, globalPoints, referrals } from "./ready.js";
import { customRoles } from "../resources/custom-roles.js";

/**
  * @param { import("discord.js").GuildMember } guildMember
*/
const guildMemberAdd = async (guildMember) => {
  const guildInvites = await guildMember.guild.invites.fetch();
  const customChannel = guildMember.guild.channels.cache.find((channel) => channel.name === customChannels.welcome);

  /**
   * @type { import("discord.js").Role }
  */
  let customRole = undefined;
  let embedMessage = new EmbedBuilder();
  /**
   * @type { import("discord.js").GuildMember }
  */
  let inviter = undefined;

  promotionPoints[guildMember.id] = 0;
  globalPoints[guildMember.id] = 0;

  guildMember.roles.cache.forEach((role) => {
    const rankIndex = customRoles.findIndex((rank) => rank === role.name);

    if (rankIndex !== -1) {
      customRole = role;
    }
  });

  guildInvites.forEach((guildInvite) => {
    if (guildInvite.uses !== referrals[guildInvite.code]) {
      inviter = guildInvite.guild.members.cache.find((member) => member.id === guildInvite.inviter.id);

      referrals[guildInvite.code] = guildInvite.uses;

      guildMember.client.emit("activity", inviter, 1000);
    }
  });

  if (inviter) {
    embedMessage.setDescription(`🌱 new ${customRole} *${guildMember}*, joined *comando generale*\ninviter: *${inviter}*\n`)
      .setThumbnail(guildMember.user.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(customRole.color);
  } else {
    embedMessage.setDescription(`🌱 new ${customRole} *${guildMember}*, joined *comando generale*\n`)
      .setThumbnail(guildMember.user.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(customRole.color);
  }

  customChannel.send({ embeds: [embedMessage] });
};

export { guildMemberAdd };