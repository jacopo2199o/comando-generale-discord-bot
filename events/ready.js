import { ActivityType } from "discord.js";
import fs from "node:fs";
import { canvasMain } from "../canvas.js";
import { generalSettings } from "../resources/general-settings.js";
import { loadFile, saveFile } from "../resources/general-utilities.js";

const globalPoints = {};
const pointsLastMove = {};
const reputationPoints = {};
const referrals = {};
const seniority = {};

/**
 * @param { import("discord.js").Client } client
 */
const ready = async (client) => {
  await Promise.all(client.guilds.cache.map(async (guild) => {
    const members = await guild.members.fetch();
    // points last move
    pointsLastMove[guild.id] = {};
    members.forEach((member) => {
      pointsLastMove[guild.id][member.id] = 0;
    });

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
    seniority[guild.id] = {};
    members.forEach((member) => {
      seniority[guild.id][member.id] = Math.round((new Date().getTime() - member.joinedAt.getTime()) / (1000 * 60 * 60 * 24));
    });
    // referrals
    const invites = await guild.invites.fetch();
    invites.forEach((invite) => {
      referrals[invite.code] = invite.uses;
    });
    // draw map
    canvasMain(guild);
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
  setInterval(async () => {
    await Promise.all(client.guilds.cache.map(async (guild) => {
      await saveFile(`./resources/backups/points-${guild.id}-backup.json`, globalPoints[guild.id]);
      await saveFile(`./resources/backups/reputation-${guild.id}-backup.json`, reputationPoints[guild.id]);
    }));
  }, generalSettings.backupInterval);
  client.user.setPresence({ activities: [{ name: "https://discord.gg/F7UTwWtwTV", type: ActivityType.Watching, }] });
  console.log(`bot ready as ${client.user.username}`);
};

export {
  globalPoints,
  pointsLastMove,
  ready,
  referrals,
  reputationPoints,
  seniority
};

