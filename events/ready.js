import { ActivityType } from "discord.js";
import fs from "node:fs";
import { generalSettings } from "../resources/general-settings.js";
import { loadFile, saveFile } from "../resources/general-utilities.js";

const globalPoints = {};
const reputationPoints = {};
const referrals = {};
const seniority = {};

/**
 * @param { import("discord.js").Client } client
 */
const ready = async (client) => {
  await Promise.all(client.guilds.cache.map(async (guild) => {
    const members = await guild.members.fetch();

    // global points
    if (fs.existsSync(`./resources/database/points-${guild.id}.json`)) {
      globalPoints[guild.id] = await loadFile(`./resources/database/points-${guild.id}.json`);

      members.forEach((member) => {
        if (globalPoints[guild.id][member.id] === undefined) {
          globalPoints[guild.id][member.id] = 0;
        }
      });

      for (const id in globalPoints[guild.id]) {
        if (members.get(id) === undefined) {
          delete globalPoints[guild.id][id];
        }
      }

      await saveFile(`./resources/database/points-${guild.id}.json`, globalPoints[guild.id]);
    } else {
      globalPoints[guild.id] = {};

      members.forEach((member) => {
        globalPoints[guild.id][member.id] = 0;
      });

      await saveFile(`./resources/database/points-${guild.id}.json`, globalPoints[guild.id]);
    }

    // reputation points
    if (fs.existsSync(`./resources/database/reputation-${guild.id}.json`)) {
      reputationPoints[guild.id] = await loadFile(`./resources/database/reputation-${guild.id}.json`);

      members.forEach((member) => {
        if (reputationPoints[guild.id][member.id] === undefined) {
          reputationPoints[guild.id][member.id] = { points: 0, gaveTo: "" };
        }
      });

      for (const id in reputationPoints[guild.id]) {
        if (members.get(id) === undefined) {
          delete reputationPoints[guild.id][id];
        }
      }

      await saveFile(`./resources/database/reputation-${guild.id}.json`, reputationPoints[guild.id]);
    } else {
      reputationPoints[guild.id] = {};

      members.forEach((member) => {
        reputationPoints[guild.id][member.id] = { points: 0, gaveTo: "" };
      });

      await saveFile(`./resources/database/reputation-${guild.id}.json`, reputationPoints[guild.id]);
    }

    // seniority
    if (fs.existsSync(`./resources/database/seniority-${guild.id}.json`)) {
      seniority[guild.id] = await loadFile(`./resources/database/seniority-${guild.id}.json`);

      members.forEach((member) => {
        if (seniority[guild.id][member.id] === undefined) {
          seniority[guild.id][member.id] = Math.round((new Date().getTime() - member.joinedAt.getTime()) / (1000 * 60 * 60 * 24));
        }
        //globalPoints[guild.id][member.id] += seniority[guild.id][member.id];
      });

      for (const memberId in seniority[guild.id]) {
        if (members.get(memberId) === undefined) {
          delete seniority[guild.id][memberId];
        }
      }

      await saveFile(`./resources/database/seniority-${guild.id}.json`, seniority[guild.id]);
      //await saveFile(`./resources/database/points-${guild.id}.json`, globalPoints[guild.id]);
    } else {
      seniority[guild.id] = {};

      members.forEach((member) => {
        seniority[guild.id][member.id] = Math.round((new Date().getTime() - member.joinedAt.getTime()) / (1000 * 60 * 60 * 24));
      });

      await saveFile(`./resources/database/seniority-${guild.id}.json`, seniority[guild.id]);
    }

    // referrals
    const invites = await guild.invites.fetch();

    invites.forEach((invite) => {
      referrals[invite.code] = invite.uses;
    });

    console.log(`legged in guild ${guild.name}`);
  }));

  let startHour = new Date().getHours();

  setInterval(() => {
    const actualHour = new Date().getHours();

    if (startHour !== actualHour) {
      console.log("a new hour started");

      client.guilds.cache.forEach((guild) => {
        client.emit("pointsDecay", guild, -1);
      });

      startHour = actualHour;
    }
  }, generalSettings.hourCheckInterval);

  setInterval(async () => {
    await Promise.all(client.guilds.cache.map(async (guild) => {
      await saveFile(`./resources/database/points-${guild.id}.json`, globalPoints[guild.id]);
      await saveFile(`./resources/database/reputation-${guild.id}.json`, reputationPoints[guild.id]);
    }));
  }, generalSettings.saveInterval);

  client.user.setPresence({ activities: [{ name: "https://discord.gg/F7UTwWtwTV", type: ActivityType.Watching, }] });

  console.log(`bot ready as ${client.user.username}`);
};

export {
  globalPoints,
  ready,
  referrals,
  reputationPoints,
  seniority
};

