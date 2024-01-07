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
    thread.client.emit("activity", owner.guildMember, channel, 100);

    messages.push(`🧵 *${owner.guildMember.displayName}* created *${thread.name}* thread in *${thread.parent.name}*\n`);
    sendMesseges(messages, channel);
    messages = [];
  }
};

export { threadCreate };