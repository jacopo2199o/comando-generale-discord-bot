const referrals = {};

/**
 * @param { import("discord.js").Client } client
 */
const ready = async (client) => {

  client.guilds.cache.forEach(async (guild) => {
    const guildInvites = await guild.invites.fetch();
    
    guildInvites.forEach((guildInvite) => {
      referrals[guildInvite.code] = guildInvite.uses;
    });
  });
  
  console.log(`bot logged in as ${client.user.username}`);
};

export { referrals, ready };