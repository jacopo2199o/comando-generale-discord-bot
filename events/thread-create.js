import { customChannels } from "../resources/custom-channels.js";
import { sendMesseges } from "../resources/general-utilities.js";

/**
 * @param { import("discord.js").ThreadChannel } thread
 * @param { Boolean } newlyCreated
 */
const threadCreate = async (thread, newlyCreated) => {
  const owner = await thread.fetchOwner();
  const channel = thread.guild.channels.cache.find((channel) => channel.name === customChannels.public);
  let messages = [];

  if (newlyCreated) {
    messages.push(`*${owner.guildMember.displayName}* created *${thread.name}* thread in *${thread.parent.name}*`);
    sendMesseges(messages, channel);
    messages = [];

    thread.client.emit("activity", owner.guildMember, 10);
  }
};

export { threadCreate };