import {
  EmbedBuilder
} from "discord.js";
import fs from "node:fs";
import {
  customChannels
} from "../resources/custom-channels.js";
import {
  getCustomRole
} from "../resources/custom-roles.js";
import {
  generalSettings
} from "../resources/general-settings.js";
import {
  loadFile,
  saveFile
} from "../resources/general-utilities.js";

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
async function ready(client) {
  console.log(`Bot ready as ${client.user.username}`);

  // Inizializzazione predefinita dei dati per ogni guild
  for (const guild of client.guilds.cache.values()) {
    const guildId = guild.id;

    if (!cooldowns[guildId]) cooldowns[guildId] = {};
    if (!globalPoints[guildId]) globalPoints[guildId] = {};
    if (!reputationPoints[guildId]) reputationPoints[guildId] = {};
    if (!transfers[guildId]) transfers[guildId] = {};
  }

  // Iterazione sulle guild con for...of
  for (const guild of client.guilds.cache.values()) {
    try {
      const members = await guild.members.fetch();

      // Inizializzazione di pointsLastMove
      pointsLastMove[guild.id] = {};
      for (const member of members.values()) {
        pointsLastMove[guild.id][member.id] = 0;
      }

      // Caricamento e salvataggio di cooldowns
      if (fs.existsSync(`./resources/database/cooldowns-${guild.id}.json`)) {
        cooldowns[guild.id] = loadFile(`./resources/database/cooldowns-${guild.id}.json`);
        for (const memberId in cooldowns[guild.id]) {
          if (!members.get(memberId)) {
            delete cooldowns[guild.id][memberId];
          }
        }
        saveFile(`./resources/database/cooldowns-${guild.id}.json`, cooldowns[guild.id]);
      } else {
        cooldowns[guild.id] = {};
        saveFile(`./resources/database/cooldowns-${guild.id}.json`, cooldowns[guild.id]);
      }

      // Caricamento e salvataggio di globalPoints
      if (fs.existsSync(`./resources/database/points-${guild.id}.json`)) {
        globalPoints[guild.id] = loadFile(`./resources/database/points-${guild.id}.json`);
        for (const member of members.values()) {
          if (globalPoints[guild.id][member.id] === undefined) {
            globalPoints[guild.id][member.id] = 0;
          }
        }
        for (const memberId in globalPoints[guild.id]) {
          if (!members.get(memberId)) {
            delete globalPoints[guild.id][memberId];
          }
        }
        saveFile(`./resources/database/points-${guild.id}.json`, globalPoints[guild.id]);
      } else {
        globalPoints[guild.id] = {};
        for (const member of members.values()) {
          globalPoints[guild.id][member.id] = 0;
        }
        saveFile(`./resources/database/points-${guild.id}.json`, globalPoints[guild.id]);
      }

      // Caricamento e salvataggio di reputationPoints
      if (fs.existsSync(`./resources/database/reputation-${guild.id}.json`)) {
        reputationPoints[guild.id] = loadFile(`./resources/database/reputation-${guild.id}.json`);
        for (const member of members.values()) {
          if (reputationPoints[guild.id][member.id] === undefined) {
            reputationPoints[guild.id][member.id] = {
              points: 0,
              gaveTo: ""
            };
          }
        }
        for (const memberId in reputationPoints[guild.id]) {
          if (!members.get(memberId)) {
            delete reputationPoints[guild.id][memberId];
          }
        }
        saveFile(`./resources/database/reputation-${guild.id}.json`, reputationPoints[guild.id]);
      } else {
        reputationPoints[guild.id] = {};
        for (const member of members.values()) {
          reputationPoints[guild.id][member.id] = {
            points: 0,
            gaveTo: ""
          };
        }
        saveFile(`./resources/database/reputation-${guild.id}.json`, reputationPoints[guild.id]);
      }

      // Caricamento e salvataggio di transfers
      if (fs.existsSync(`./resources/database/transfers-${guild.id}.json`)) {
        transfers[guild.id] = loadFile(`./resources/database/transfers-${guild.id}.json`);
        for (const memberId in transfers[guild.id]) {
          if (!members.get(memberId)) {
            delete transfers[guild.id][memberId];
          }
        }
        saveFile(`./resources/database/transfers-${guild.id}.json`, transfers[guild.id]);
      } else {
        transfers[guild.id] = {};
        saveFile(`./resources/database/transfers-${guild.id}.json`, transfers[guild.id]);
      }

      // Referrals
      const invites = await guild.invites.fetch();
      for (const invite of invites.values()) {
        referrals[invite.code] = invite.uses;
      }

      // Seniority
      seniority[guild.id] = {};
      for (const member of members.values()) {
        seniority[guild.id][member.id] = Math.round(
          (new Date().getTime() - member.joinedAt.getTime()) / (1000 * 60 * 60 * 24)
        );
      }

      console.log(`Logged in guild ${guild.name}`);
    } catch (error) {
      console.error(`Error processing guild ${guild.name}:`, error.message);
    }
  }

  // Daily actions
  let startDay = new Date().getDay();
  setInterval(() => {
    try {
      const actualDay = new Date().getDay();
      if (startDay !== actualDay) {
        for (const guild of client.guilds.cache.values()) {
          client.emit("pointsDecay", guild, -24);
          client.emit("pointsDistribution", guild);
        }
        startDay = actualDay;
        console.log("A new day started");
      }
    } catch (error) {
      console.error("Error in daily actions interval:", error.message);
    }
  }, generalSettings.hourCheckInterval);

  // Cooldowns check for expirations
  setInterval(async () => {
    try {
      for (const guild of client.guilds.cache.values()) {
        for (const memberId in cooldowns[guild.id]) {
          const isExpired = cooldowns[guild.id][memberId].endPeriod < new Date().getTime();
          if (isExpired) {
            delete cooldowns[guild.id][memberId];
            const member = guild.members.cache.get(memberId);
            const customRole = getCustomRole(member);
            if (member && customRole) {
              const message = new EmbedBuilder()
                .setDescription(`🛡️ ${customRole} *${member}* cooldown penalty expired`)
                .setThumbnail(member.displayAvatarURL({ dynamic: true }))
                .setFooter({ text: `${member}`, iconURL: `${member.displayAvatarURL()}` })
                .setTimestamp()
                .setColor("DarkGreen");
              const channel = guild.channels.cache.find(channel => channel.name === customChannels.activity) ?? guild.publicUpdatesChannel;
              await channel.send({ embeds: [message] });
            } else {
              console.error("ready: cooldowns check: member or custom role undefined");
            }
          }
        }
      }
    } catch (error) {
      console.error("Error in cooldowns check interval:", error.message);
    }
  }, generalSettings.backupInterval);

  // Transfers check for expiration
  setInterval(async () => {
    try {
      for (const guild of client.guilds.cache.values()) {
        for (const memberId in transfers[guild.id]) {
          const isExpired = transfers[guild.id][memberId].endPeriod < new Date().getTime();
          if (isExpired) {
            delete transfers[guild.id][memberId];
            const member = guild.members.cache.get(memberId);
            const customRole = getCustomRole(member);
            if (member && customRole) {
              const message = new EmbedBuilder()
                .setDescription(`🛡️ ${customRole} *${member}* transfer penalty expired`)
                .setThumbnail(member.displayAvatarURL({ dynamic: true }))
                .setFooter({ text: `${member}`, iconURL: `${member.displayAvatarURL()}` })
                .setTimestamp()
                .setColor("DarkGreen");
              const channel = guild.channels.cache.find(channel => channel.name === customChannels.activity) ?? guild.publicUpdatesChannel;
              await channel.send({ embeds: [message] });
            } else {
              console.error("ready: transfers check: member or custom role undefined");
            }
          }
        }
      }
    } catch (error) {
      console.error("Error in transfers check interval:", error.message);
    }
  }, generalSettings.backupInterval);

  // Regular data save
  setInterval(() => {
    try {
      for (const guild of client.guilds.cache.values()) {
        const guildId = guild.id;

        if (cooldowns[guildId]) {
          saveFile(`./resources/database/cooldowns-${guildId}.json`, cooldowns[guildId]);
        } else {
          console.warn(`Cooldowns for guild ${guildId} are undefined. Skipping save.`);
        }

        if (globalPoints[guildId]) {
          saveFile(`./resources/database/points-${guildId}.json`, globalPoints[guildId]);
        } else {
          console.warn(`Global points for guild ${guildId} are undefined. Skipping save.`);
        }

        if (reputationPoints[guildId]) {
          saveFile(`./resources/database/reputation-${guildId}.json`, reputationPoints[guildId]);
        } else {
          console.warn(`Reputation points for guild ${guildId} are undefined. Skipping save.`);
        }

        if (transfers[guildId]) {
          saveFile(`./resources/database/transfers-${guildId}.json`, transfers[guildId]);
        } else {
          console.warn(`Transfers for guild ${guildId} are undefined. Skipping save.`);
        }
      }
    } catch (error) {
      console.error("Error in regular data save interval:", error.message);
    }
  }, generalSettings.saveInterval);

  // Backup data save
  setInterval(() => {
    try {
      for (const guild of client.guilds.cache.values()) {
        const guildId = guild.id;

        if (cooldowns[guildId]) {
          saveFile(`./resources/backups/cooldowns-${guildId}.json`, cooldowns[guildId]);
        } else {
          console.warn(`Cooldowns for guild ${guildId} are undefined. Skipping backup.`);
        }

        if (globalPoints[guildId]) {
          saveFile(`./resources/backups/points-${guildId}.json`, globalPoints[guildId]);
        } else {
          console.warn(`Global points for guild ${guildId} are undefined. Skipping backup.`);
        }

        if (reputationPoints[guildId]) {
          saveFile(`./resources/backups/reputation-${guildId}.json`, reputationPoints[guildId]);
        } else {
          console.warn(`Reputation points for guild ${guildId} are undefined. Skipping backup.`);
        }

        if (transfers[guildId]) {
          saveFile(`./resources/backups/transfers-${guildId}.json`, transfers[guildId]);
        } else {
          console.warn(`Transfers for guild ${guildId} are undefined. Skipping backup.`);
        }
      }
    } catch (error) {
      console.error("Error in backup data save interval:", error.message);
    }
  }, generalSettings.backupInterval);
}

export {
  ready,
  cooldowns,
  globalPoints,
  pointsLastMove,
  referrals,
  reputationPoints,
  seniority,
  transfers
};