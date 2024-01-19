import { EmbedBuilder } from "discord.js";
import { customChannels } from "../resources/custom-channels.js";
import { customPoints } from "../resources/custom-points.js";
import { globalPoints, reputationPoints } from "./ready.js";

/**
* @param { import("discord.js").GuildMember } guildMember
*/
const guildMemberRemove = async (guildMember) => {
  const channel = guildMember.guild.channels.cache.find((channel) => channel.name === customChannels.private);
  const embedMessage = new EmbedBuilder();
  const gaveToId = reputationPoints[guildMember.guild.id][guildMember.id].gaveTo;
  const penaltyPoints = Math.round(customPoints.guildMemberRemove / guildMember.guild.memberCount);
  
  if (gaveToId !== "") {
    reputationPoints[guildMember.guild.id][gaveToId].points = -1;
  }

  delete globalPoints[guildMember.guild.id][guildMember.id];
  delete reputationPoints[guildMember.guild.id][guildMember.id];

  for(const guildMemberId in globalPoints[guildMember.guild.id]) {
    const otherGuildMember = guildMember.guild.members.cache.get(guildMemberId);

    guildMember.client.emit("activity", otherGuildMember, penaltyPoints);
  }

  embedMessage
    .setTitle("🍂 member lost")
    .setDescription(`*${guildMember.displayName}* left *comando generale*\n`)
    .addFields({name: "promotion points", value: `${penaltyPoints} ⭐`, inline: true})
    .addFields({name: "to", value: `${guildMember.guild.roles.everyone}`, inline: true})
    .setThumbnail(guildMember.user.displayAvatarURL({ dynamic: true }))
    .setTimestamp()
    .setColor("DarkRed");

  channel.send({ embeds: [embedMessage] });
};

export { guildMemberRemove };

