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
async function ready(
  client
) {
  client.guilds.cache.map(
    async function (
      guild
    ) {
      const members = await guild.members.fetch();
      // points last move
      pointsLastMove[guild.id] = {};
      members.forEach(
        function (
          member
        ) {
          pointsLastMove[guild.id][member.id] = 0;
        }
      );
      // cooldonws
      if (
        fs.existsSync(
          `./resources/database/cooldowns-${guild.id}.json`
        ) === true
      ) {
        cooldowns[guild.id] = loadFile(
          `./resources/database/cooldowns-${guild.id}.json`
        );
        for (
          const memberId in cooldowns[guild.id]
        ) {
          if (
            members.get(
              memberId
            ) === undefined
          ) {
            delete cooldowns[guild.id][memberId];
          }
        }
        saveFile(
          `./resources/database/cooldowns-${guild.id}.json`,
          cooldowns[guild.id]
        );
      } else {
        cooldowns[guild.id] = {};
        saveFile(
          `./resources/database/cooldowns-${guild.id}.json`,
          cooldowns[guild.id]
        );
      }
      // global points
      if (
        fs.existsSync(
          `./resources/database/points-${guild.id}.json`
        ) === true
      ) {
        globalPoints[guild.id] = loadFile(
          `./resources/database/points-${guild.id}.json`
        );
        members.forEach(
          function (
            member
          ) {
            if (
              globalPoints[guild.id][member.id] === undefined
            ) {
              globalPoints[guild.id][member.id] = 0;
            }
          }
        );
        for (
          const memberId in globalPoints[guild.id]
        ) {
          if (
            members.get(
              memberId
            ) === undefined
          ) {
            delete globalPoints[guild.id][memberId];
          }
        }
        saveFile(
          `./resources/database/points-${guild.id}.json`,
          globalPoints[guild.id]
        );
      } else {
        globalPoints[guild.id] = {};
        members.forEach(
          function (
            member
          ) {
            globalPoints[guild.id][member.id] = 0;
          }
        );
        saveFile(
          `./resources/database/points-${guild.id}.json`,
          globalPoints[guild.id]
        );
      }
      // reputation points
      if (
        fs.existsSync(
          `./resources/database/reputation-${guild.id}.json`
        ) === true
      ) {
        reputationPoints[guild.id] = loadFile(
          `./resources/database/reputation-${guild.id}.json`
        );
        members.forEach(
          function (
            member
          ) {
            if (
              reputationPoints[guild.id][member.id] === undefined
            ) {
              reputationPoints[guild.id][member.id] = {
                points: 0,
                gaveTo: ""
              };
            }
          }
        );
        for (
          const memberId in reputationPoints[guild.id]
        ) {
          if (
            members.get(
              memberId
            ) === undefined
          ) {
            delete reputationPoints[guild.id][memberId];
          }
        }
        saveFile(
          `./resources/database/reputation-${guild.id}.json`,
          reputationPoints[guild.id]
        );
      } else {
        reputationPoints[guild.id] = {};
        members.forEach(
          function (
            member
          ) {
            reputationPoints[guild.id][member.id] = {
              points: 0,
              gaveTo: ""
            };
          }
        );
        saveFile(
          `./resources/database/reputation-${guild.id}.json`,
          reputationPoints[guild.id]
        );
      }
      // referrals
      const invites = await guild.invites.fetch();
      invites.forEach(
        function (
          invite
        ) {
          referrals[invite.code] = invite.uses;
        }
      );
      // seniority
      seniority[guild.id] = {};
      members.forEach(
        function (
          member
        ) {
          seniority[guild.id][member.id] = Math.round(
            (
              new Date().getTime() - member.joinedAt.getTime()
            ) / (
              1000 * 60 * 60 * 24
            )
          );
        }
      );
      // transfer
      if (
        fs.existsSync(
          `./resources/database/transfers-${guild.id}.json`
        ) === true
      ) {
        transfers[guild.id] = loadFile(
          `./resources/database/transfers-${guild.id}.json`
        );
        for (
          const memberId in transfers[guild.id]
        ) {
          if (
            members.get(
              memberId
            ) === undefined
          ) {
            delete transfers[guild.id][memberId];
          }
        }
        saveFile(
          `./resources/database/transfers-${guild.id}.json`,
          transfers[guild.id]
        );
      } else {
        transfers[guild.id] = {};
        saveFile(
          `./resources/database/transfers-${guild.id}.json`,
          transfers[guild.id]
        );
      }
      console.log(
        `logged in guild ${guild.name}`
      );
    }
  );
  // daily actions
  let startDay = new Date().getDay();
  setInterval(
    function () {
      const actualDay = new Date().getDay();
      if (
        startDay !== actualDay
      ) {
        client.guilds.cache.forEach(
          function (
            guild
          ) {
            client.emit(
              "pointsDecay",
              guild,
              -24
            );
            client.emit(
              "pointsDistribution",
              guild
            );
          }
        );
        startDay = actualDay;
        console.log(
          "a new day started"
        );
      }
    },
    generalSettings.hourCheckInterval
  );
  // cooldowns check for expirations
  setInterval(
    function () {
      client.guilds.cache.forEach(
        function (
          guild
        ) {
          for (
            const memberId in cooldowns[guild.id]
          ) {
            const isExpired = cooldowns[guild.id][memberId].endPeriod < new Date().getTime() ? true : false;
            if (
              isExpired === true
            ) {
              delete cooldowns[guild.id][memberId];
              const member = guild.members.cache.get(
                memberId
              );
              const customRole = getCustomRole(
                member
              );
              if (
                member !== undefined &&
                customRole !== undefined
              ) {
                const message = new EmbedBuilder().setDescription(
                  `🛡️ ${customRole} *${member}* cooldown penalty expired`
                ).setThumbnail(
                  member.displayAvatarURL(
                    {
                      dynamic: true
                    }
                  )
                ).setFooter(
                  {
                    text: `${member}`,
                    iconURL: `${member.displayAvatarURL()}`
                  }
                ).setTimestamp().setColor(
                  "DarkGreen"
                );
                const channel = guild.channels.cache.find(
                  function (
                    channel
                  ) {
                    return channel.name === customChannels.activity;
                  }
                ) ?? guild.publicUpdatesChannel;
                channel.send(
                  {
                    embeds: [
                      message
                    ]
                  }
                );
              } else {
                console.error(
                  "ready: cooldowns check: member or custom role undefined"
                );
              }
            }
          }
        }
      );
    },
    generalSettings.backupInterval
  );
  // transfers check for expiration
  setInterval(
    function () {
      client.guilds.cache.forEach(
        function (
          guild
        ) {
          for (
            const memberId in transfers[guild.id]
          ) {
            const isExpired = transfers[guild.id][memberId].endPeriod < new Date().getTime() ? true : false;
            if (
              isExpired === true
            ) {
              delete transfers[guild.id][memberId];
              const member = guild.members.cache.get(
                memberId
              );
              const customRole = getCustomRole(
                member
              );
              if (
                member !== undefined &&
                customRole !== undefined
              ) {
                const message = new EmbedBuilder().setDescription(
                  `🛡️ ${customRole} *${member}* transfer penalty expired`
                ).setThumbnail(
                  member.displayAvatarURL(
                    {
                      dynamic: true
                    }
                  )
                ).setFooter(
                  {
                    text: `${member}`,
                    iconURL: `${member.displayAvatarURL()}`
                  }
                ).setTimestamp().setColor(
                  "DarkGreen"
                );
                const channel = guild.channels.cache.find(
                  function (
                    channel
                  ) {
                    return channel.name === customChannels.activity;
                  }
                ) ?? guild.publicUpdatesChannel;
                channel.send(
                  {
                    embeds: [
                      message
                    ]
                  }
                );
              } else {
                console.error(
                  "ready: transfers check: member or custom role undefined"
                );
              }
            }
          }
        }
      );
    },
    generalSettings.backupInterval
  );
  // regular data save
  setInterval(
    function () {
      client.guilds.cache.forEach(
        function (guild) {
          const guildId = guild.id;

          // Verifica e salva cooldowns
          if (cooldowns[guildId]) {
            saveFile(`./resources/database/cooldowns-${guildId}.json`, cooldowns[guildId]);
          } else {
            console.warn(`Cooldowns for guild ${guildId} are undefined. Skipping save.`);
          }

          // Verifica e salva globalPoints
          if (globalPoints[guildId]) {
            saveFile(`./resources/database/points-${guildId}.json`, globalPoints[guildId]);
          } else {
            console.warn(`Global points for guild ${guildId} are undefined. Skipping save.`);
          }

          // Verifica e salva reputationPoints
          if (reputationPoints[guildId]) {
            saveFile(`./resources/database/reputation-${guildId}.json`, reputationPoints[guildId]);
          } else {
            console.warn(`Reputation points for guild ${guildId} are undefined. Skipping save.`);
          }

          // Verifica e salva transfers
          if (transfers[guildId]) {
            saveFile(`./resources/database/transfers-${guildId}.json`, transfers[guildId]);
          } else {
            console.warn(`Transfers for guild ${guildId} are undefined. Skipping save.`);
          }
        }
      );
    },
    generalSettings.saveInterval
  );
  // backup data save
  setInterval(
    function () {
      client.guilds.cache.forEach(
        function (
          guild
        ) {
          saveFile(
            `./resources/backups/cooldowns-${guild.id}.json`,
            cooldowns[guild.id]
          );
          saveFile(
            `./resources/backups/points-${guild.id}.json`,
            globalPoints[guild.id]
          );
          saveFile(
            `./resources/backups/reputation-${guild.id}.json`,
            reputationPoints[guild.id]
          );
          saveFile(
            `./resources/backups/transfers-${guild.id}.json`,
            transfers[guild.id]
          );
        }
      );
    },
    generalSettings.backupInterval
  );
  console.log(
    `bot ready as ${client.user.username}`
  );
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

