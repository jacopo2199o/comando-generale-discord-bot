import { ActivityType } from "discord.js";
import fs from "fs";
import { customPoints } from "../resources/custom-points.js";
import { loadFile, saveFile } from "../resources/general-utilities.js";

const globalPoints = {};
const reputationPoints = {};
const referrals = {};
let isBotReady = false;

/**
 * @param { import("discord.js").Client } client
*/
const ready = async (client) => {
  await Promise.all(client.guilds.cache.map(async (guild) => {
    const guildInvites = await guild.invites.fetch();
    const guildMembers = await guild.members.fetch();

    // global points
    if (fs.existsSync(`./resources/database/points-${guild.id}.json`)) {
      globalPoints[guild.id] = await loadFile(`./resources/database/points-${guild.id}.json`);

      if (guildMembers.size > Object.keys(globalPoints[guild.id]).length) {
        console.log(`guildMember size ${guildMembers.size} > saved points ${Object.keys(globalPoints[guild.id]).length}`);

        guildMembers.forEach((guildMember) => {
          if (globalPoints[guild.id][guildMember.id] === undefined) {
            globalPoints[guild.id][guildMember.id] = customPoints.start;
          }
        });
      } else if (guildMembers.size < Object.keys(globalPoints[guild.id]).length) {
        console.log(`guildMember size ${guildMembers.size} < saved points ${Object.keys(globalPoints[guild.id]).length}`);

        for (const id in globalPoints[guild.id]) {
          if (guildMembers.get(id) === undefined) {
            delete globalPoints[guild.id][id];
          }
        }

        await saveFile(`./resources/database/points-${guild.id}.json`, globalPoints[guild.id]);
      }
    } else {
      globalPoints[guild.id] = {};

      guildMembers.forEach((guildMember) => {
        globalPoints[guild.id][guildMember.id] = customPoints.start;
      });

      await saveFile(`./resources/database/points-${guild.id}.json`, globalPoints[guild.id]);
    }

    // reputation points
    if (fs.existsSync(`./resources/database/reputation-${guild.id}.json`)) {
      reputationPoints[guild.id] = await loadFile(`./resources/database/reputation-${guild.id}.json`);

      if (guildMembers.size > Object.keys(reputationPoints[guild.id]).length) {
        console.log(`guildMember size ${guildMembers.size} > saved reputations ${Object.keys(reputationPoints[guild.id]).length}`);

        guildMembers.forEach((guildMember) => {
          if (reputationPoints[guild.id][guildMember.id] === undefined) {
            reputationPoints[guild.id][guildMember.id] = customPoints.start;
          }
        });
      } else if (guildMembers.size < Object.keys(reputationPoints[guild.id]).length) {
        console.log(`guildMember size ${guildMembers.size} < saved reputations ${Object.keys(reputationPoints[guild.id]).length}`);

        for (const id in reputationPoints[guild.id]) {
          if (guildMembers.get(id) === undefined) {
            delete reputationPoints[guild.id][id];
          }
        }

        await saveFile(`./resources/database/reputation-${guild.id}.json`, reputationPoints[guild.id]);
      }
    } else {
      reputationPoints[guild.id] = {};

      guildMembers.forEach((guildMember) => {
        reputationPoints[guild.id][guildMember.id] = {
          points: 0,
          gaveTo: ""
        };
      });

      await saveFile(`./resources/database/reputation-${guild.id}.json`, reputationPoints[guild.id]);
    }

    guildInvites.forEach((guildInvite) => {
      referrals[guildInvite.code] = guildInvite.uses;
    });

    console.log(`legged in guild ${guild.name}`);
  }));

  client.user.setPresence({
    activities: [{
      name: "https://discord.gg/F7UTwWtwTV",
      type: ActivityType.Watching,
    }]
  });

  isBotReady = true;

  console.log(`bot ready as ${client.user.username}`);
};

export {
  globalPoints,
  isBotReady,
  ready,
  referrals,
  reputationPoints
};

