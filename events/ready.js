import { Community } from "../community.js";

const communities = new Map();

/**
 * @param { import("discord.js").Client } client
 */
const ready = async (client) => {
  client.guilds.cache.forEach(guild => {
    communities.set(guild.id, new Community(guild));
  });

  console.log(`bot logged in as ${client.user.username}`);
};

export { communities, ready };