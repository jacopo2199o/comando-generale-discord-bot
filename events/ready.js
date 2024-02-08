import { ActivityType, EmbedBuilder } from "discord.js";
import fs from "node:fs";
import { customChannels } from "../resources/custom-channels.js";
import { getCustomRole } from "../resources/custom-roles.js";
import { generalSettings } from "../resources/general-settings.js";
import { loadFile, saveFile } from "../resources/general-utilities.js";

const cooldowns = {};
const globalPoints = {};
const pointsLastMove = {};
const reputationPoints = {};
const referrals = {};
const seniority = {};
const transfers = {};

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

    // cooldonws
    if (fs.existsSync(`./resources/database/cooldowns-${guild.id}.json`)) {
      cooldowns[guild.id] = await loadFile(`./resources/database/cooldowns-${guild.id}.json`);

      for (const memberId in cooldowns[guild.id]) {
        if (members.get(memberId) === undefined) {
          delete cooldowns[guild.id][memberId];
        }
      }

      await saveFile(`./resources/database/cooldowns-${guild.id}.json`, cooldowns[guild.id]);
    } else {
      cooldowns[guild.id] = {};
      await saveFile(`./resources/database/cooldowns-${guild.id}.json`, cooldowns[guild.id]);
    }

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

    // referrals
    const invites = await guild.invites.fetch();
    invites.forEach((invite) => {
      referrals[invite.code] = invite.uses;
    });
    // seniority
    seniority[guild.id] = {};
    members.forEach((member) => {
      seniority[guild.id][member.id] = Math.round((new Date().getTime() - member.joinedAt.getTime()) / (1000 * 60 * 60 * 24));
    });
    // transfer
    if (fs.existsSync(`./resources/database/transfers-${guild.id}.json`)) {
      transfers[guild.id] = await loadFile(`./resources/database/transfers-${guild.id}.json`);

      for (const memberId in transfers[guild.id]) {
        if (members.get(memberId) === undefined) {
          delete transfers[guild.id][memberId];
        }
      }

      await saveFile(`./resources/database/transfers-${guild.id}.json`, transfers[guild.id]);
    } else {
      transfers[guild.id] = {};
      await saveFile(`./resources/database/transfers-${guild.id}.json`, transfers[guild.id]);
    }

    // draw map
    //canvasMain(guild);
    console.log(`legged in guild ${guild.name}`);
  }));
  // points decay
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
  // cooldowns check for expirations
  setInterval(() => {
    client.guilds.cache.forEach((guild) => {
      for (const memberId in cooldowns[guild.id]) {
        const isExpired = cooldowns[guild.id][memberId].endPeriod < new Date().getTime() ? true : false;

        if (isExpired === true) {
          delete cooldowns[guild.id][memberId];
          const member = guild.members.cache.get(memberId);
          const role = getCustomRole(member);

          if (member !== undefined && role !== undefined) {
            const message = new EmbedBuilder();
            message.setDescription(`🛡️ ${role} *${member}* cooldown penalty expired`);
            message.setThumbnail(member.displayAvatarURL({ dynamic: true }));
            message.setFooter({ text: `${member}`, iconURL: `${member.displayAvatarURL()}` });
            message.setTimestamp();
            message.setColor("DarkGreen");
            const channel = guild.channels.cache.find((channel) => channel.name === customChannels.activity)
              ?? guild.publicUpdatesChannel;
            channel.send({ embeds: [message] });
          } else {
            console.error(member, role);
          }
        }
      }
    });
  }, generalSettings.backupInterval);
  // transfers check for expiration
  setInterval(() => {
    client.guilds.cache.forEach((guild) => {
      for (const memberId in transfers[guild.id]) {
        const isExpired = transfers[guild.id][memberId].endPeriod < new Date().getTime() ? true : false;

        if (isExpired === true) {
          delete transfers[guild.id][memberId];
          const member = guild.members.cache.get(memberId);
          const role = getCustomRole(member);

          if (member !== undefined && role !== undefined) {
            const message = new EmbedBuilder();
            message.setDescription(`🛡️ ${role} *${member}* transfer penalty expired`);
            message.setThumbnail(member.displayAvatarURL({ dynamic: true }));
            message.setFooter({ text: `${member}`, iconURL: `${member.displayAvatarURL()}` });
            message.setTimestamp();
            message.setColor("DarkGreen");
            const channel = guild.channels.cache.find((channel) => channel.name === customChannels.activity)
              ?? guild.publicUpdatesChannel;
            channel.send({ embeds: [message] });
          } else {
            console.error(member, role);
          }
        }
      }
    });
  }, generalSettings.backupInterval);
  // regular data save
  setInterval(async () => {
    await Promise.all(client.guilds.cache.map(async (guild) => {
      await saveFile(`./resources/database/cooldowns-${guild.id}.json`, cooldowns[guild.id]);
      await saveFile(`./resources/database/points-${guild.id}.json`, globalPoints[guild.id]);
      await saveFile(`./resources/database/reputation-${guild.id}.json`, reputationPoints[guild.id]);
      await saveFile(`./resources/database/transfers-${guild.id}.json`, transfers[guild.id]);
    }));
  }, generalSettings.saveInterval);
  // backup data save
  setInterval(async () => {
    await Promise.all(client.guilds.cache.map(async (guild) => {
      await saveFile(`./resources/backups/cooldowns-${guild.id}-backup.json`, cooldowns[guild.id]);
      await saveFile(`./resources/backups/points-${guild.id}-backup.json`, globalPoints[guild.id]);
      await saveFile(`./resources/backups/reputation-${guild.id}-backup.json`, reputationPoints[guild.id]);
      await saveFile(`./resources/backups/transfers-${guild.id}-backup.json`, transfers[guild.id]);
    }));
  }, generalSettings.backupInterval);
  client.user.setPresence({ activities: [{ name: "https://discord.gg/F7UTwWtwTV", type: ActivityType.Watching, }] });
  console.log(`bot ready as ${client.user.username}`);
};

export {
  cooldowns,
  globalPoints,
  pointsLastMove,
  ready,
  referrals,
  reputationPoints,
  seniority,
  transfers
};

