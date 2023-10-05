import { SlashCommandBuilder } from "discord.js";
import dotenv from "dotenv";
import { community } from "../events/ready.js";
import { saveFile } from "../general-utilities.js";

dotenv.config();

const activity = Object.defineProperty({
  profiles: undefined,
  filePath: "./resources/activity-points.json"
}, "filePath", {
  writable: false,
  configurable: false
});
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

/**
 * @param { import("discord.js").Guild } guild
 * @param { import("discord.js").Client } client
 * @param { community } community
 * @param { activity } activity
 */
const start = (guild, client, community, activity) => {
  const pointsDecay = Object.freeze({
    low: 1,
    moderate: 2,
    high: 4
  });

  activity.profiles.forEach(async (profile) => {
    // const guildMember = guild.members.cache.find(guildMember => guildMember.id === memberActivity.id);
    const rank = ((ranks, roleId) => {
      const index = ranks.findIndex(rank => rank.id === roleId);
      return Object.freeze({
        next: ranks[index - 1],
        actual: ranks[index],
        previous: ranks[index + 1],
      });
    })(community.ranks, profile.roleId);

    // subtract points
    if (profile.points > 0) {
      if (profile.points <= 100) {
        profile.points -= pointsDecay.low;
      } else if (profile.points <= 800) {
        profile.points -= pointsDecay.moderate;
      } else if (profile.points <= 7000) {
        profile.points -= pointsDecay.high;
      }
    }

    // update roles
    if (
      rank.previous &&
      profile.points < rank.actual.points
    ) {
      // guildMember.roles.remove(actualRole.id);
      // guildMember.roles.add(previousRole.id);
      profile.roleId = rank.previous.id;
      profile.roleName = guild.roles.cache.get(rank.previous.id).name;

      // i messaggi dovranno essere pubblicati nell'apposito evento
      const message = `<@${profile.id}> downgraded to <@&${rank.previous.id}>`;
      await client.channels.cache.get(testChannelId)
        .send({
          content: message,
          flags: [4096]
        });
    } else if (
      rank.next &&
      profile.points >= rank.next.points
    ) {
      // guildMember.roles.remove(actualRole.id);
      // guildMember.roles.add(nextRole.id);
      profile.roleId = rank.next.id;
      profile.roleName = guild.roles.cache.get(rank.next.id).name;

      // i messaggi dovranno essere pubblicati nell'apposito evento
      const message = `<@${profile.id}> promoted to <@&${rank.next.id}>`;
      await client.channels.cache.get(testChannelId)
        .send({
          content: message,
          flags: [4096]
        });
    }
  });

  saveFile(activity.profiles, activity.filePath);
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
    firstClass: 8000,
    secondClass: 800,
    thirdClass: 80
  });

  // fetch new data at every command use
  const client = interaction.client;
  const guild = interaction.client.guilds.resolve(community.id);
  const members = await interaction.client.guilds.resolve(community.id)
    .members.fetch();

  // create members activity table
  activity.profiles = members.filter(member => member.user.id !== process.env.client_id)
    .map(member => {
      return Object.defineProperties({
        id: member.id,
        name: member.displayName,
        points: 0,
        roleId: undefined,
        roleName: undefined
      }, {
        id: {
          writable: false,
          configurable: false
        },
        name: {
          writable: false,
          configurable: false
        }
      });
    });

  // set initial activity points
  members.forEach(member => {
    const profile = activity.profiles.find(profile => profile.id === member.id);
    if (profile) {
      member.roles.cache.forEach(role => {
        const rank = community.ranks.find(rank => rank.id === role.id);
        if (
          rank &&
          rank.points >= profile.points
        ) {
          if (rank.points <= maxPoints.thirdClass) {
            profile.points = rank.points + additionalPoints.thirdClass;
          } else if (rank.points <= maxPoints.secondClass) {
            profile.points = rank.points + additionalPoints.secondClass;
          } else if (rank.points <= maxPoints.firstClass) {
            profile.points = rank.points + additionalPoints.firstClass;
          }
          profile.roleId = role.id;
          profile.roleName = role.name;
        }
      });
    }
  });

  saveFile(activity.profiles, activity.filePath);

  dayInterval.millisecondsStartTime = new Date();
  start(guild, client, community, activity);
  dayInterval.id = setInterval(start, dayInterval.millisecondsDuration, guild, client, community, activity);

  await interaction.editReply("activity points created: start monitoring...");
};

export {
  activity,
  cooldown,
  dayInterval,
  data,
  start,
  execute
};
