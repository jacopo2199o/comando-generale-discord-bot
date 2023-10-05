import { SlashCommandBuilder } from "discord.js";
import dotenv from "dotenv";
import { community } from "../events/ready.js";
import { saveFile } from "../general-utilities.js";

dotenv.config();

let activityPoints = undefined;
const activityPointsFilePath = "./resources/activity-points.json";
const comandoGeneraleBotId = "1149977789496311888";
const cooldown = 4;
const data = new SlashCommandBuilder()
  .setName("start-activity-points")
  .setDescription("set initial activity points and start monitoring");

const dayInterval = Object.defineProperty({
  id: undefined,
  millisecondsDuration: 2000, // correggere nel tempo reale in millisecondi di un giorno
  millisecondsStartTime: undefined,
  millisecondsRemaining: undefined
}, "millisecondsDuration", {
  writable: false,
  configurable: false
});

const testChannelId = "1100786695613456455"; // jacopo2199o general channel

const start = (guild, client, ranks, activityPoints) => {
  const pointsDecay = Object.freeze({
    low: 1,
    moderate: 2,
    high: 4
  });

  activityPoints.forEach(async (memberActivity) => {
    // const guildMember = guild.members.cache.find(guildMember => guildMember.id === memberActivity.id);
    const rank = ((rank, id) => {
      const index = rank.findIndex(role => role.id === id);
      return Object.freeze({
        next: rank[index - 1],
        actual: rank[index],
        previous: rank[index + 1],
      });
    })(ranks, memberActivity.roleId);

    // subtract points
    if (memberActivity.points > 0) {
      if (memberActivity.points <= 100) {
        memberActivity.points -= pointsDecay.low;
      } else if (memberActivity.points <= 800) {
        memberActivity.points -= pointsDecay.moderate;
      } else if (memberActivity.points <= 7000) {
        memberActivity.points -= pointsDecay.high;
      }
    }

    // update roles
    if (
      rank.previous &&
      memberActivity.points < rank.actual.points
    ) {
      // guildMember.roles.remove(actualRole.id);
      // guildMember.roles.add(previousRole.id);
      memberActivity.roleId = rank.previous.id;
      memberActivity.roleName = guild.roles.cache.get(rank.previous.id).name;

      // i messaggi dovranno essere pubblicati nell'apposito evento
      const message = `<@${memberActivity.id}> downgraded to <@&${rank.previous.id}>`;
      await client.channels.cache.get(testChannelId)
        .send({
          content: message,
          flags: [4096]
        });
    } else if (
      rank.next &&
      memberActivity.points >= rank.next.points
    ) {
      // guildMember.roles.remove(actualRole.id);
      // guildMember.roles.add(nextRole.id);
      memberActivity.roleId = rank.next.id;
      memberActivity.roleName = guild.roles.cache.get(rank.next.id).name;

      // i messaggi dovranno essere pubblicati nell'apposito evento
      const message = `<@${memberActivity.id}> promoted to <@&${rank.next.id}>`;
      await client.channels.cache.get(testChannelId)
        .send({
          content: message,
          flags: [4096]
        });
    }
  });
  saveFile(activityPoints, activityPointsFilePath);
};

/**
 * @param {import("discord.js").Interaction} interaction
*/
const execute = async (interaction) => {
  await interaction.deferReply();

  const additionalPoints = Object.freeze({
    firstClass: 500,
    secondClass: 50,
    thirdClass: 5
  });
  const maxPoints = Object.freeze({
    firstClass: 7000,
    secondClass: 800,
    thirdClass: 80
  });
  // fetch new data at connection
  const client = interaction.client;
  const guild = interaction.client.guilds.resolve(community.id);
  const membersCollection = await guild.members.fetch();

  // create members activity table
  activityPoints = (await guild.members.fetch())
    .filter(member => member.user.id !== comandoGeneraleBotId) // id del bot "comando generale"
    .map(member => {
      return {
        "id": member.id,
        "name": member.displayName,
        "points": 0,
        "roleId": undefined,
        "roleName": undefined
      };
    });

  // set initial activity points
  membersCollection.forEach(member => {
    const memberActivity = activityPoints.find(memberActivity => memberActivity.id === member.id);
    if (memberActivity) {
      member.roles.cache.forEach(role => {
        const rank = community.ranks.find(rank => rank.id === role.id);
        if (
          rank &&
          rank.points > memberActivity.points
        ) {
          if (rank.points <= maxPoints.thirdClass) {
            memberActivity.points = rank.points + additionalPoints.thirdClass;
          } else if (rank.points <= maxPoints.secondClass) {
            memberActivity.points = rank.points + additionalPoints.secondClass;
          } else if (rank.points <= maxPoints.firstClass) {
            memberActivity.points = rank.points + additionalPoints.firstClass;
          }
          memberActivity.roleId = role.id;
          memberActivity.roleName = role.name;
        }
      });
    }
  });

  saveFile(activityPoints, activityPointsFilePath);

  dayInterval.millisecondsStartTime = new Date();
  start(guild, client, community.ranks, activityPoints);
  dayInterval.id = setInterval(start, dayInterval.millisecondsDuration, guild, client, community.ranks, activityPoints);

  await interaction.editReply("activity points created: start monitoring...");
};

export {
  activityPoints,
  activityPointsFilePath,
  cooldown,
  dayInterval,
  data,
  start,
  execute
};
