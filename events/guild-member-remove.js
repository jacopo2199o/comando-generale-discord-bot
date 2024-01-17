import { EmbedBuilder } from "discord.js";
import { customChannels } from "../resources/custom-channels.js";
import { customPoints } from "../resources/custom-points.js";
import { globalPoints, reputationPoints } from "./ready.js";

/**
* @param { import("discord.js").GuildMember } guildMember
*/
const guildMemberRemove = async (guildMember) => {
  const customChannel = guildMember.guild.channels.cache.find((channel) => channel.name === customChannels.private);
  const embedMessage = new EmbedBuilder();

  delete globalPoints[guildMember.guild.id][guildMember.id];
  delete reputationPoints[guildMember.guild.id][guildMember.id];

  for(const id in globalPoints[guildMember.guild.id]) {
    const otherGuildMember = guildMember.guild.members.cache.get(id);

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
