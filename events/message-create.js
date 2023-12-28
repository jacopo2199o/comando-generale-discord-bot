/**
 * @param { import("discord.js").Message } message
 */
const messageCreate = async (message) => {
  if (!message.author.bot && message.author.id !== message.guild.ownerId) {
    message.client.emit("activityDone", message.member, 1);
  }
};

export { messageCreate };