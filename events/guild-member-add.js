import { EmbedBuilder } from "discord.js";
import { customChannels } from "../resources/custom-channels.js";
import { promotionPoints, globalPoints, referrals } from "./ready.js";
import { customPoints } from "../resources/custom-points.js";

/**
  * @param { import("discord.js").GuildMember } guildMember
*/
const guildMemberAdd = async (guildMember) => {
  const guildInvites = await guildMember.guild.invites.fetch();
  const customChannel = guildMember.guild.channels.cache.find((channel) => channel.name === customChannels.welcome);
  
  let embedMessage = new EmbedBuilder();
  /**
  * @type { import("discord.js").GuildMember }
  */
  let inviter = undefined;

  promotionPoints[guildMember.id] = 0;
  globalPoints[guildMember.id] = 0;

  guildInvites.forEach((guildInvite) => {
    if (guildInvite.uses !== referrals[guildInvite.code]) {
      inviter = guildInvite.guild.members.cache.find((member) => member.id === guildInvite.inviter.id);

      referrals[guildInvite.code] = guildInvite.uses;

      guildMember.client.emit("activity", inviter, customPoints.guildMemberAdd);
    }
  });

  if (inviter) {
    embedMessage
      .setTitle("🌱 new member")
      .setDescription(`*${guildMember}*, joined *comando generale*`)
      .addFields({ name: "inviter", value: `inviter: *${inviter}*`, inline: true })
      .setThumbnail(guildMember.displayAvatarURL({ dynamic: true }))
      .setFooter({ text: `+${customPoints.guildMemberAdd} ⭐ to ${inviter.displayName}`, iconURL: `${inviter.displayAvatarURL()}` })
      .setTimestamp()
      .setColor("DarkGreen");
  } else {
    embedMessage
      .setTitle("🌱 new member")
      .setDescription(`*${guildMember}*, joined *comando generale*`)
      .setThumbnail(guildMember.displayAvatarURL({ dynamic: true }))
      .addFields({ name: "inviter", value: "none / temporary", inline: true })
      .setTimestamp()
      .setColor("DarkBlue");
  }

  customChannel.send({ embeds: [embedMessage] });
};

export { guildMemberAdd };