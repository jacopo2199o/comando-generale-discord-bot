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
  const isComandoGeneraleMember = oldMember.roles.cache.find((role) => role.name === "compagnia comando generale");
  const oldMemberRole = getCustomRole(oldMember)
    || getCustomRole(oldMember.guild.members.cache.get(oldMember.id));
  const message = new EmbedBuilder();
  const gaveToId = reputationPoints[oldMember.guild.id][oldMember.id].gaveTo;
  const penaltyPoints = Math.round(customPoints.guildMemberRemove / oldMember.guild.memberCount);

  console.log(`member who quit had: ${oldMemberRole} role`);

  if (gaveToId !== "") {
    reputationPoints[oldMember.guild.id][gaveToId].points = -1;
  }

  delete globalPoints[oldMember.guild.id][oldMember.id];
  delete reputationPoints[oldMember.guild.id][oldMember.id];

  for (const id in globalPoints[oldMember.guild.id]) {
    const member = oldMember.guild.members.cache.get(id);

    oldMember.client.emit("activity", member, penaltyPoints);
  }

  if (oldMemberRole !== undefined) {
    if (isComandoGeneraleMember !== undefined) {
      message
        .setTitle("🍂 member lost")
        .setDescription(`${oldMemberRole} *${oldMember.displayName}* left *comando generale*`)
        .addFields({ name: "notes", value: "he had *compagnia comando generale* role, remove him from alliance too", inline: true })
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

