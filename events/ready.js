import { Events } from "discord.js";
import { Community } from "../community.js";

const communities = new Map();
const name = Events.ClientReady;
const once = true;

/**
 * @param { import("discord.js").Client } client
 */
const execute = async (client) => {
  client.guilds.cache.forEach(guild => {
    communities.set(guild.id, new Community(guild));
  });

  console.log(`bot logged in as ${client.user.username}`);
};

export {
  communities,
  name,
  once,
  execute
};