import { EmbedBuilder } from "discord.js";
import { customChannels } from "../resources/custom-channels.js";
import { customPoints } from "../resources/custom-points.js";
import { getCustomRole } from "../resources/general-utilities.js";
import { globalPoints, reputationPoints } from "./ready.js";

/**
* @param { import("discord.js").GuildMember } oldMember
*/
const guildMemberRemove = async (oldMember) => {
  const channel = oldMember.guild.channels.cache.find((channel) => channel.name === customChannels.private)
    || oldMember.guild.channels.cache.get(oldMember.guild.publicUpdatesChannelId);
  const gaveToId = reputationPoints[oldMember.guild.id][oldMember.id].gaveTo;
  const oldMemberRole = getCustomRole(oldMember)
    || getCustomRole(oldMember.guild.members.cache.get(oldMember.id))
    || "n.a.";
  const message = new EmbedBuilder();
  const penaltyPoints = Math.round(customPoints.guildMemberRemove / oldMember.guild.memberCount);
  const roleComandoGenerale = oldMember.roles.cache.find((role) => role.name === "compagnia comando generale");

  if (gaveToId !== "") {
    reputationPoints[oldMember.guild.id][gaveToId].points = -1;
  }

  delete globalPoints[oldMember.guild.id][oldMember.id];
  delete reputationPoints[oldMember.guild.id][oldMember.id];

  for (const memberId in globalPoints[oldMember.guild.id]) {
    const member = oldMember.guild.members.cache.get(memberId);

    oldMember.client.emit("activity", member, penaltyPoints);
  }

  if (oldMemberRole !== undefined) {
    if (roleComandoGenerale !== undefined) {
      message
        .setTitle("🍂 member lost")
        .setDescription(`${oldMemberRole} *${oldMember.displayName}* left *comando generale*`)
        .addFields({ name: "notes", value: `he had *${roleComandoGenerale}* role, remove him from alliance too`, inline: true })
        .addFields({ name: "promotion points", value: `${penaltyPoints} ⭐`, inline: true })
        .addFields({ name: "to", value: `${oldMember.guild.roles.everyone}`, inline: true })
        .setThumbnail(oldMember.user.displayAvatarURL({ dynamic: true }))
        .setTimestamp()
        .setColor("DarkRed");
    } else {
      message
        .setTitle("🍂 member lost")
        .setDescription(`${oldMemberRole} *${oldMember.displayName}* left *comando generale*`)
        .addFields({ name: "promotion points", value: `${penaltyPoints} ⭐`, inline: true })
        .addFields({ name: "to", value: `${oldMember.guild.roles.everyone}`, inline: true })
        .setThumbnail(oldMember.user.displayAvatarURL({ dynamic: true }))
        .setTimestamp()
        .setColor("DarkRed");
    }
  } else {
    message
      .setTitle("🍂 member lost")
      .setDescription(`*${oldMember.displayName}* left *comando generale*\n`)
      .addFields({ name: "promotion points", value: `${penaltyPoints} ⭐`, inline: true })
      .addFields({ name: "to", value: `${oldMember.guild.roles.everyone}`, inline: true })
      .setThumbnail(oldMember.user.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor("DarkRed");
  }

  channel.send({ embeds: [message] });
};

export { guildMemberRemove };

