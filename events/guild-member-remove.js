import { EmbedBuilder } from "discord.js";
import { customChannels } from "../resources/custom-channels.js";
import { promotionPoints, globalPoints } from "./ready.js";
import { customPoints } from "../resources/custom-points.js";

/**
* @param { import("discord.js").GuildMember } guildMember
*/
const guildMemberRemove = async (guildMember) => {
  const customChannel = guildMember.guild.channels.cache.find((channel) => channel.name === customChannels.private);

  let embedMessage = new EmbedBuilder();

  delete promotionPoints[guildMember.id];
  delete globalPoints[guildMember.id];

  for(const guildMemberId in promotionPoints) {
    const otherGuildMember = guildMember.guild.members.cache.find((member) => member.id === guildMemberId);

    guildMember.client.emit("activity", otherGuildMember, customPoints.guildMemberRemove);
  }

  embedMessage
    .setTitle("🍂 member lost")
    .setDescription(`*${guildMember.displayName}* left *comando generale*\n`)
    .addFields({name: "promotion points", value: `${customPoints.guildMemberRemove} ⭐`, inline: true})
    .addFields({name: "to", value: `${guildMember.guild.roles.everyone}`, inline: true})
    .setThumbnail(guildMember.user.displayAvatarURL({ dynamic: true }))
    .setTimestamp()
    .setColor("DarkRed");

  customChannel.send({ embeds: [embedMessage] });
};

export { guildMemberRemove };