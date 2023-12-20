/**
 * @param { import("discord.js").Client } client
 */
const ready = async (client) => {
  console.log(`bot logged in as ${client.user.username}`);
};

export { ready };