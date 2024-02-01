import { EmbedBuilder } from "discord.js";
import { customChannels } from "../resources/custom-channels.js";
import { customPoints, getCalculatedPoints } from "../resources/custom-points.js";
import { globalPoints, referrals, reputationPoints } from "./ready.js";

/**
  * @param { import("discord.js").GuildMember } newMember
*/
const guildMemberAdd = async (newMember) => {
  const channel = newMember.guild.channels.cache.find((channel) => channel.name === customChannels.activity)
    || newMember.guild.channels.cache.get(newMember.guild.publicUpdatesChannelId);
  const message = new EmbedBuilder();
  const invites = await newMember.guild.invites.fetch();

  /**
   * @type { import("discord.js").GuildMember }
  */
  let inviter = undefined;
  let inviterPoints = undefined;
  let inviteUses = undefined;

  globalPoints[newMember.guild.id][newMember.id] = 0;
  reputationPoints[newMember.guild.id][newMember.id] = {
    points: 0,
    gaveTo: ""
  };

  invites.forEach((invite) => {
    if (invite.uses !== referrals[invite.code]) {
      referrals[invite.code] = invite.uses;

      inviter = invite.guild.members.cache.get(invite.inviter.id);
      inviteUses = invite.uses;

      if (inviter !== undefined) {
        inviterPoints = getCalculatedPoints(
          customPoints.guildMemberAdd,
          reputationPoints[inviter.guild.id][inviter.id].points
        );
      }
    }
  });

  if (inviter !== undefined) {
    newMember.client.emit("activity", inviter, inviterPoints);

    message
      .setTitle("🌱 new member")
      .setDescription(`*${newMember}*, joined *comando generale*`)
      .addFields({ name: "inviter", value: `${inviter}`, inline: true })
      .addFields({ name: "uses", value: `${inviteUses}`, inline: true })
      .setThumbnail(newMember.displayAvatarURL({ dynamic: true }))
      .setFooter({ text: `${inviterPoints} ⭐ to ${inviter.displayName}`, iconURL: `${inviter.displayAvatarURL()}` })
      .setTimestamp()
      .setColor("DarkGreen");
  } else {
    message
      .setTitle("🌱 new member")
      .setDescription(`*${newMember}*, joined *comando generale*`)
      .setThumbnail(newMember.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor("DarkBlue");
  }

  channel.send({ embeds: [message] });
};

export { guildMemberAdd };

