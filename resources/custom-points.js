const customPoints = {
  guildMemberAdd: 1000,
  guildMemberRemove: -1,
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

export { customPoints };

