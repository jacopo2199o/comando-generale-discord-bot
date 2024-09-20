import { globalPoints } from "../events/ready.js";

const customPoints = {
  cooldownPenalty: -100,
  guildMemberAdd: 1000,
  guildMemberRemove: -1000,
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
  threadCreate: 100,
  transferPenalty: -200
};
const drops = { promotionPoints: 100 };

function getCalculatedPoints(customPoints, reputationPoints) {
  const reputationFactor = (reputationPoints / 10) + 1;
  return Math.round(customPoints * reputationFactor);
}

/**
 * @param {import("discord.js").GuildMember} member
 * @returns {Number}
 */
function getLevel(member) {
  return Math.floor(globalPoints[member.guild.id][member.id] / customPoints.promotionPoints) + 1;
}

export {
  customPoints,
  drops,
  getCalculatedPoints,
  getLevel
};

