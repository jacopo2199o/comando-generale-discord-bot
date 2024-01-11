//import fs from "fs";

const promotionPoints = {};
const globalPoints = {};
const reputationPoints = {};
const referrals = {};


/**
 * @param { import("discord.js").Client } client
 */
const ready = async (client) => {
  client.guilds.cache.forEach(async (guild) => {
    const guildInvites = await guild.invites.fetch();
    const guildMembers = await guild.members.fetch();

    guildMembers.forEach((guildMember) => {
      if(!guildMember.user.bot) {
        promotionPoints[guildMember.id] = 10;
        globalPoints[guildMember.id] = 10;
        reputationPoints[guildMember.id] = {
          points: 0,
          gaveTo: undefined
        };
      }
    });
    
    guildInvites.forEach((guildInvite) => {
      referrals[guildInvite.code] = guildInvite.uses;
    });
  });

  /*   const myObject = { name: "reading json working" };
    fs.writeFileSync("./resources/test.json", JSON.stringify(myObject));
  
    const readedObject = fs.readFileSync("./resources/test.json");
    console.log(JSON.parse(readedObject)); */

  console.log(`bot logged in as ${client.user.username}`);
};

export {
  promotionPoints,
  globalPoints,
  reputationPoints,
  referrals,
  ready
};