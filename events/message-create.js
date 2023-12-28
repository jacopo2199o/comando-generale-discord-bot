import { sendMesseges } from "../resources/general-utilities.js";
import { activityPoints } from "./ready.js";

/**
 * @param { import("discord.js").Message } message
 */
const messageCreate = async (message) => {
  if (!message.author.bot && message.author.id !== message.guild.ownerId) {
    const channel = message.guild.channels.cache.find((channel) => channel.name === "🤖bot-testing");
    let messages = [];

    activityPoints[message.author.id] += 1;

    messages.push(`${message.author} received 1 activity point, total: ${activityPoints[message.author.id]}`);
    sendMesseges(messages, channel);
    messages = [];
  }
};

export { messageCreate };