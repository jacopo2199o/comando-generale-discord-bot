import { customChannels } from "../resources/custom-channels.js";
import { sendMesseges } from "../resources/general-utilities.js";

/**
 * @param { import("discord.js").Message } message
 */
const messageCreate = async (message) => {
  if (!message.author.bot) {
    const channel = message.guild.channels.cache.find((channel) => channel.name === customChannels.public);
    let messages = [];

    messages.push(`*${message.member.displayName}* sended a new message in *${message.channel.name}*`);
    sendMesseges(messages, channel);
    messages = [];
    
    message.client.emit("activity", message.member, 1);
  }
};

export { messageCreate };