import { EmbedBuilder } from "discord.js";
import { customChannels } from "../resources/custom-channels.js";
import { customRoles } from "../resources/custom-roles.js";

/**
 * @param { import("discord.js").Message } message
 */
const messageCreate = async (message) => {
  if (!message.author.bot) {
    const customChannel = message.guild.channels.cache.find((channel) => channel.name === customChannels.public);
    const guildMember = message.guild.members.cache.find((member) => member.id === message.author.id);

    let customRoleColor = undefined;
    let customRole = undefined;
    let embedMessage = new EmbedBuilder();

    guildMember.roles.cache.forEach((role) => {
      const rankIndex = customRoles.findIndex((rank) => rank === role.name);
      
      if (rankIndex !== -1) {
        customRoleColor = role.color;
        customRole = role;
      }
    });

    message.client.emit("activity", guildMember, 1);

    embedMessage.setDescription(`💬 ${customRole} *${guildMember}* sended a new message in *${message.channel.name}*\n`)
      //.setAuthor({name: "\u200b", iconURL: message.author.avatarURL()})
      //.addFields({ name: "promotion points", value: "+1", inline: true })
      //.setThumbnail(guildMember.user.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(customRoleColor);

    customChannel.send({ embeds: [embedMessage] });
  }
};

export { messageCreate };