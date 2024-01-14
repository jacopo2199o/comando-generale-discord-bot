import { EmbedBuilder } from "discord.js";
import { customChannels } from "../resources/custom-channels.js";
import { customPoints } from "../resources/custom-points.js";
import { globalPoints, referrals } from "./ready.js";

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

  globalPoints[guildMember.guild.id][guildMember.id].g = customPoints.start;
  globalPoints[guildMember.guild.id][guildMember.id].pp = customPoints.start;

  await guildMember.fetch();

  guildInvites.forEach((guildInvite) => {
    if (guildInvite.uses !== referrals[guildInvite.code]) {
      //inviter = guildInvite.guild.members.cache.find((member) => member.id === guildInvite.inviter.id);
      inviter = guildInvite.guild.members.cache.get(guildInvite.inviter.id);

      referrals[guildInvite.code] = guildInvite.uses;
    }
  });
  
  if (inviter) {
    guildMember.client.emit("activity", inviter, customPoints.guildMemberAdd);

    embedMessage
      .setTitle("🌱 new member")
      .setDescription(`*${guildMember}*, joined *comando generale*`)
      .addFields({ name: "inviter", value: `*${inviter}*`, inline: true })
      .setThumbnail(guildMember.displayAvatarURL({ dynamic: true }))
      .setFooter({ text: `${customPoints.guildMemberAdd} ⭐ to ${inviter.displayName}`, iconURL: `${inviter.displayAvatarURL()}` })
      .setTimestamp()
      .setColor("DarkGreen");
  } else {
    embedMessage
      .setTitle("🌱 new member")
      .setDescription(`*${guildMember}*, joined *comando generale*`)
      .setThumbnail(guildMember.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor("DarkBlue");
  }

  customChannel.send({ embeds: [embedMessage] });
};

export { guildMemberAdd };

