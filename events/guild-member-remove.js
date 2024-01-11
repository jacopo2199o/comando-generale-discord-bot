import { EmbedBuilder } from "discord.js";
import { customChannels } from "../resources/custom-channels.js";
import { promotionPoints, globalPoints } from "./ready.js";

/**
* @param { import("discord.js").GuildMember } guildMember
*/
const guildMemberRemove = async (guildMember) => {
  const customChannel = guildMember.guild.channels.cache.find((channel) => channel.name === customChannels.private);

  let embedMessage = new EmbedBuilder();

  delete promotionPoints[guildMember.id];
  delete globalPoints[guildMember.id];

  embedMessage
    .setTitle("🍂 member lost")
    .setDescription(`*${guildMember.displayName}* left *comando generale*\n`)
    .setThumbnail(guildMember.user.displayAvatarURL({ dynamic: true }))
    .setTimestamp()
    .setColor("DarkRed");

  customChannel.send({ embeds: [embedMessage] });
};

export { guildMemberRemove };