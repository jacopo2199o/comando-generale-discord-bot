import fs from "node:fs";
import { SlashCommandBuilder } from "discord.js";
import { serverId } from "../index.js";
import dotenv from "dotenv";

dotenv.config();

let membersActivity = undefined;
let rolesTable = undefined;

const cooldown = 4;
const data = new SlashCommandBuilder()
  .setName("start-activity-points")
  .setDescription("set initial activity points and start monitoring");

// test or real mode
const jRolesTable = [
  { id: "1138015362416390204", points: 40 }, // rosso
  { id: "1137408000462688397", points: 20 }, // arancione
  { id: "1137407767368433715", points: 10 }, // giallo
];
const cgRolesTable = [
  { id: "1085101543679864862", points: 7000 }, // ministro
  { id: "1109520111330676859", points: 6000 }, // senatore
  { id: "1109520175713239110", points: 5000 }, // governatore
  { id: "1109520330034249778", points: 4000 }, // prefetto
  { id: "1109520466865041449", points: 3000 }, // sottoprefetto
  { id: "1109520512822034462", points: 2000 }, // segretario
  { id: "1109520556119818250", points: 1000 }, // sottosegretario
  { id: "1072494016081440838", points: 800 }, // principale
  { id: "1062347912132165762", points: 700 }, // dirigente
  { id: "1072426721837580339", points: 600 }, // coordinatore capo
  { id: "1062347799091490998", points: 500 }, // coordinatore
  { id: "1062347622255439942", points: 400 }, // sovrintendente capo
  { id: "1062347431947288677", points: 300 }, // sovrintendente
  { id: "1062347254142345217", points: 200 }, // assistente capo
  { id: "1062347134122332200", points: 100 }, // assistente
  { id: "956497551853510657", points: 80 }, // gran generale
  { id: "956482376589017151", points: 70 }, // generale
  { id: "958332483210997780", points: 60 }, // gran colonnello
  { id: "962694733229072384", points: 50 }, // colonnello
  { id: "1007289184236613724", points: 40 }, // gran comandante
  { id: "1007289333998440568", points: 30 }, // comandate
  { id: "1072250981888311337", points: 20 }, // tenente
  { id: "1008665802716741733", points: 10 }, // membro
];
if (serverId === process.env.comando_generale_id) {
  rolesTable = cgRolesTable;
} else if (serverId === process.env.jacopo2199o_id) {
  rolesTable = jRolesTable;
}

const activityPointsPath = "activity-points.json";
const testChannelId = "1100786695613456455"; // jacopo2199o general channel
const comandoGeneraleBotId = "1149977789496311888";

const additionalPoints = {
  firstClass: 500,
  secondClass: 50,
  thirdClass: 5
};
Object.freeze(additionalPoints);
const pointsDecay = {
  low: 1,
  moderate: 2,
  high: 4
};
Object.freeze(pointsDecay);
const maxPoints = {
  firstClass: 7000,
  secondClass: 800,
  thirdClass: 80
};
Object.freeze(maxPoints);

const dayInterval = {
  id: undefined,
  millisecondInterval: 10000, // correggere nel tempo reale in millisecondi di un giorno
  millisecondsStartTime: undefined,
  millisecondsRemaining: undefined
};
Object.defineProperty(dayInterval, "millisecondsInterval", { writable: false, configurable: false });

const writeFile = (data, filePath) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), error => {
    if (error) throw error;
  });
};

const start = (guild, client, rolesTable, membersActivity) => {
  membersActivity.forEach(async (memberActivity) => {
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
    // const guildMember = guild.members.cache.find(guildMember => guildMember.id === memberActivity.id);
    const roleTableIndex = rolesTable.findIndex(roleTable => roleTable.id === memberActivity.roleId);
    const nextRole = rolesTable[roleTableIndex - 1];
    const actualRole = rolesTable[roleTableIndex];
    const previousRole = rolesTable[roleTableIndex + 1];
    if (previousRole) {
      if (memberActivity.points < actualRole.points) {
        // guildMember.roles.remove(actualRole.id);
        // guildMember.roles.add(previousRole.id);
        memberActivity.roleId = previousRole.id;

        // i messaggi dovranno essere pubblicati nell'apposito evento
        const message = `<@${memberActivity.id}> downgraded to <@&${previousRole.id}>`;
        await client.channels.cache.get(testChannelId)
          .send({
            content: message,
            flags: [4096]
          });
      }
    }
    if (nextRole) {
      if (memberActivity.points >= nextRole.points) {
        // guildMember.roles.remove(actualRole.id);
        // guildMember.roles.add(nextRole.id);
        memberActivity.roleId = nextRole.id;

        // i messaggi dovranno essere pubblicati nell'apposito evento
        const message = `<@${memberActivity.id}> promoted to <@&${nextRole.id}>`;
        await client.channels.cache.get(testChannelId)
          .send({
            content: message,
            flags: [4096]
          });
      }
    }

    writeFile(membersActivity, activityPointsPath);
  });
};

/**
 * @param {import("discord.js").Interaction} interaction
*/
const execute = async (interaction) => {
  await interaction.deferReply();

  // fetch new data at connection
  const client = interaction.client;
  const guild = client.guilds.resolve(serverId);
  const membersCollection = await guild.members.fetch();

  // create members activity table
  membersActivity = (await guild.members.fetch())
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
    const memberActivity = membersActivity.find(memberActivity => memberActivity.id === member.id);
    if (memberActivity) {
      member.roles.cache.forEach(role => {
        const roleTable = rolesTable.find(roleTable => roleTable.id === role.id);
        if (roleTable) {
          if (roleTable.points > memberActivity.points) {
            if (roleTable.points <= maxPoints.thirdClass) {
              memberActivity.points = roleTable.points + additionalPoints.thirdClass;
            } else if (roleTable.points <= maxPoints.secondClass) {
              memberActivity.points = roleTable.points + additionalPoints.secondClass;
            } else if (roleTable.points <= maxPoints.firstClass) {
              memberActivity.points = roleTable.points + additionalPoints.firstClass;
            }
            memberActivity.roleId = role.id;
            memberActivity.roleName = role.name;
          }
        }
      });
    }
  });

  writeFile(membersActivity, activityPointsPath);

  dayInterval.millisecondsStartTime = new Date();
  start(guild, client, rolesTable, membersActivity);
  dayInterval.id = setInterval(start, dayInterval.millisecondInterval, guild, client, rolesTable, membersActivity);

  await interaction.editReply("activity points created: start monitoring...");
};

export {
  activityPointsPath,
  cooldown,
  dayInterval,
  data,
  membersActivity,
  rolesTable,
  start,
  execute
};
