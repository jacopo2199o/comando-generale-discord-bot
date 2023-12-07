/**
 * @param { import("discord.js").Guild } guild
 */
const Community = function (guild) {
  this.client = guild.client;
  this.id = guild.id;
  this.adminId = guild.ownerId;
};

export { Community };