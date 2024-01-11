import { EmbedBuilder } from "discord.js";
import { customChannels } from "../resources/custom-channels.js";
import { getCustomRole } from "../resources/general-utilities.js";
import { customPoints } from "../resources/custom-points.js";

/**
 * @param { import("discord.js").Message } message
 */
const messageCreate = async (message) => {
  if (!message.author.bot) {
    const customChannel = message.guild.channels.cache.find((channel) => channel.name === customChannels.public);
    const guildMember = message.guild.members.cache.find((member) => member.id === message.author.id);
    const customRole = getCustomRole(guildMember);
  
    let embedMessage = new EmbedBuilder();
  
    await message.channel.fetch();
  
    message.client.emit("activity", guildMember, customPoints.messageCreate);
  
    embedMessage
      .setDescription(`💬 ${customRole} *${guildMember}* sended a new message in *${message.channel.name}*\n`)
      .setFooter({ text: `+${customPoints.messageCreate} ⭐ to ${guildMember.displayName}`, iconURL: `${guildMember.displayAvatarURL()}` })
      .setTimestamp()
      .setColor(customRole.color);
  
    customChannel.send({ embeds: [embedMessage] });
  }

};

export { messageCreate };