import { EmbedBuilder } from "discord.js";
import { customChannels } from "../resources/custom-channels.js";
import { customPoints } from "../resources/custom-points.js";
import { getCustomRole } from "../resources/general-utilities.js";

/**
 * @param { import("discord.js").Message } message
 */
const messageCreate = async (message) => {
  if (!message.author.bot) {
    const customChannel = message.guild.channels.cache.find((channel) => channel.name === customChannels.public);
    const customRole = getCustomRole(message.guild.members.cache.get(message.author.id));
    const embedMessage = new EmbedBuilder();
    const guildMember = message.guild.members.cache.get(message.author.id);
  
  
    await message.channel.fetch();
  
    message.client.emit("activity", guildMember, customPoints.messageCreate);
  
    embedMessage
      .setDescription(`💬 ${customRole} *${guildMember}* sended a new message in *${message.channel.name}*\n`)
      .setFooter({ text: `${customPoints.messageCreate} ⭐ to ${guildMember.displayName}`, iconURL: `${guildMember.displayAvatarURL()}` })
      .setTimestamp()
      .setColor(customRole.color);
  
    customChannel.send({ embeds: [embedMessage] });
  }

};

export { messageCreate };

