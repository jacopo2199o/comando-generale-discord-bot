import { sendMesseges } from "../resources/general-utilities.js";

/**
 * @param { import("discord.js").ThreadChannel } thread
 * @param { Boolean } newlyCreated
 */
const threadCreate = async (thread, newlyCreated) => {
  const channel = thread.guild.channels.cache.find((channel) => channel.name === "🤖bot-testing");
  const messages = [];

  if (newlyCreated) {
    messages.push(`new thread *${thread.name}* created in *${thread.parent.name}*`);

    sendMesseges(messages, channel);
  }
};

export { threadCreate };