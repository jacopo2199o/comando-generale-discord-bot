import { customChannels } from "../resources/custom-channels.js";
import { customRoles } from "../resources/custom-roles.js";
import { sendMesseges } from "../resources/general-utilities.js";

/**
 * @param { import("discord.js").Message } message
 */
const messageCreate = async (message) => {
  if (!message.author.bot) {
    const channel = message.guild.channels.cache.find((channel) => channel.name === customChannels.public);
    const guildMember = message.guild.members.cache.find((member) => member.id === message.author.id);

    let memberRank = undefined;
    let messages = [];

    guildMember.roles.cache.forEach((role) => {
      const rankIndex = customRoles.findIndex((rank) => rank === role.name);
      
      if (rankIndex !== -1) {
        memberRank = customRoles[rankIndex];
      }
    });
    
    message.client.emit("activity", guildMember, channel, 1);

    messages.push(`💬 ${memberRank} *${message.member.displayName}* sended a new message in *${message.channel.name}*\n`);    
    sendMesseges(messages, channel);
    messages = [];
  }
};

export { messageCreate };