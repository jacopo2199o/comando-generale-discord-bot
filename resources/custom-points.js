import { globalPoints } from "../events/ready.js";

const customPoints = {
  guildMemberAdd: 1000,
  guildMemberRemove: -1000,
  start: 10,
  interactionCreate: 2,
  inviteCreate: 10,
  messageCreate: 1,
  messageDelete: {
    executor: 2,
    author: -10
  },
  messageReactionAdd: {
    maker: 1,
    taker: 2
  },
  promotionPoints: 1000,
  reputationPoints: {
    maker: 1,
    taker: 100,
    oldTaker: -100
  },
  threadCreate: 100
};

const drops = {
  promotionPoints: 100
};

const getCalculatedPoints = (customPoints, reputationPoints) => {
  const reputationFactor = (reputationPoints / 10) + 1;

  return Math.round(customPoints * reputationFactor);
};

/**
 * @param {import("discord.js").GuildMember} member
 * @returns {Number}
 */
const getLevel = (member) => {
  return Math.floor(globalPoints[member.guild.id][member.id] / customPoints.promotionPoints) + 1;
};

export {
  customPoints,
  drops,
  getCalculatedPoints,
  getLevel
};

