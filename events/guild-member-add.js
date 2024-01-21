import { EmbedBuilder } from "discord.js";
import { customChannels } from "../resources/custom-channels.js";
import { customPoints, getCalculatedPoints } from "../resources/custom-points.js";
import { globalPoints, referrals, reputationPoints } from "./ready.js";

/**
  * @param { import("discord.js").GuildMember } guildMember
*/
const guildMemberAdd = async (guildMember) => {
  const channel = guildMember.guild.channels.cache.find((channel) => channel.name === customChannels.activity)
    || guildMember.guild.channels.cache.get(guildMember.guild.publicUpdatesChannelId);
  const embedMessage = new EmbedBuilder();
  const invites = await guildMember.guild.invites.fetch();

  /**
   * @type { import("discord.js").GuildMember }
  */
  let inviter = undefined;
  let inviterPoints = undefined;
  let inviteUses = undefined;

  globalPoints[guildMember.guild.id][guildMember.id] = customPoints.start;
  reputationPoints[guildMember.guild.id][guildMember.id] = {
    points: 0,
    gaveTo: ""
  };

  invites.forEach((invite) => {
    if (invite.uses !== referrals[invite.code]) {
      inviter = invite.guild.members.cache.get(invite.inviter.id);
      inviterPoints = getCalculatedPoints(
        customPoints.guildMemberAdd,
        reputationPoints[inviter.guild.id][inviter.id].points
      );
      inviteUses = invite.uses;

      referrals[invite.code] = invite.uses;
    }
  });

  if (inviter !== undefined) {
    guildMember.client.emit("activity", inviter, inviterPoints);

    embedMessage
      .setTitle("🌱 new member")
      .setDescription(`*${guildMember}*, joined *comando generale*`)
      .addFields({ name: "inviter", value: `*${inviter}*`, inline: true })
      .addFields({ name: "uses", value: `${inviteUses}`, inline: true })
      .setThumbnail(guildMember.displayAvatarURL({ dynamic: true }))
      .setFooter({ text: `${inviterPoints} ⭐ to ${inviter.displayName}`, iconURL: `${inviter.displayAvatarURL()}` })
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

  channel.send({ embeds: [embedMessage] });
};

export { guildMemberAdd };

