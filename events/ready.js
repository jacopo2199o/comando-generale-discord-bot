//import fs from "fs";

const activityPoints = {};
const referrals = {};

/**
 * @param { import("discord.js").Client } client
 */
const ready = async (client) => {
  client.guilds.cache.forEach(async (guild) => {
    const guildInvites = await guild.invites.fetch();
    const guildMembers = await guild.members.fetch();

    guildInvites.forEach((guildInvite) => {
      referrals[guildInvite.code] = guildInvite.uses;
    });

    guildMembers.forEach((guildMember) => {
      if(!guildMember.user.bot && guildMember.id !== guild.ownerId) {
        activityPoints[guildMember.id] = 0;
      }
    });
  });

  /*   const myObject = { name: "reading json working" };
    fs.writeFileSync("./resources/test.json", JSON.stringify(myObject));
  
    const readedObject = fs.readFileSync("./resources/test.json");
    console.log(JSON.parse(readedObject)); */

  console.log(`bot logged in as ${client.user.username}`);
};

export {
  activityPoints,
  referrals,
  ready
};