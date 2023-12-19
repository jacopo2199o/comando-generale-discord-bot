/**
 * @param { import("discord.js").Guild } guild
 */
const Community = function (guild) {
  this.client = guild.client;
  this.id = guild.id;
  this.admin = guild.ownerId;
  this.logChannel = guild.channels.cache.find((channel) => channel.name === "🤖bot-testing");
};

export { Community };