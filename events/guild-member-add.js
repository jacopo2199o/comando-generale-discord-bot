import { EmbedBuilder } from "discord.js";
import { customChannels } from "../resources/custom-channels.js";
import { customPoints } from "../resources/custom-points.js";
import { globalPoints, referrals, reputationPoints } from "./ready.js";

/**
  * @param { import("discord.js").GuildMember } guildMember
*/
const guildMemberAdd = async (guildMember) => {
  const customChannel = guildMember.guild.channels.cache.find((channel) => channel.name === customChannels.welcome);
  const embedMessage = new EmbedBuilder();
  const guildInvites = await guildMember.guild.invites.fetch();

  /**
   * @type { import("discord.js").GuildMember }
  */
  let inviter = undefined;

  globalPoints[guildMember.guild.id][guildMember.id] = customPoints.start;
  reputationPoints[guildMember.guild.id][guildMember.id] = {
    points: 0,
    gaveTo: undefined
  };

  await guildMember.fetch();

  guildInvites.forEach((guildInvite) => {
    if (guildInvite.uses !== referrals[guildInvite.code]) {
      inviter = guildInvite.guild.members.cache.get(guildInvite.inviter.id);

      referrals[guildInvite.code] = guildInvite.uses;
    }
  });
  
  if (inviter !== undefined) {
    guildMember.client.emit("activity", inviter, customPoints.guildMemberAdd);

    embedMessage
      .setTitle("🌱 new member")
      .setDescription(`*${guildMember}*, joined *comando generale*`)
      .addFields({ name: "inviter", value: `*${inviter}*`, inline: true })
      .addFields({ name: "uses", value: `*${referrals[inviter.id]}*`, inline: true })
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

