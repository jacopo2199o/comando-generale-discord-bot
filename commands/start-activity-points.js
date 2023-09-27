import { SlashCommandBuilder } from "discord.js";
import fs from "node:fs";
import { argv } from "node:process";
import dotenv from "dotenv";

dotenv.config();

let client = undefined;
let guild = undefined;
let dayInterval = {
  id: undefined,
  startTime: undefined,
  millisecondsRemaining: undefined
};
let membersActivity = undefined;

const filePath = "activity-points.json";
const dayMilliseconds = 2000; // correggere nel tempo reale in millisecondi di un giorno
const pointsDecay = {
  low: 1,
  moderate: 2,
  high: 4
};

// test or real mode
const jRolesTable = [
  { id: "1138015362416390204", points: 1000 }, // rosso
  { id: "1137408000462688397", points: 70 }, // arancione
  { id: "1137407767368433715", points: 10 }, // giallo
];
const cgRolesTable = [
  { id: "1085101543679864862", points: 7000 }, // ministro
  { id: "1109520111330676859", points: 6000 }, // senatore
  { id: "1109520175713239110", points: 5000 }, // prefetto
  { id: "1109520330034249778", points: 4000 }, // sottoprefetto
  { id: "1109520466865041449", points: 3000 }, // procuratore
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
  { id: "956497551853510657", points: 70 }, // gran generale
  { id: "956482376589017151", points: 60 }, // generale
  { id: "958332483210997780", points: 50 }, // gran colonnello
  { id: "962694733229072384", points: 40 }, // colonnello
  { id: "1007289184236613724", points: 30 }, // gran comandante
  { id: "1007289333998440568", points: 20 }, // comandate
  { id: "1072250981888311337", points: 10 }, // tenente
  { id: "1008665802716741733", points: 0 }, // membro
];
const serverId = argv[2] === "-real" ? process.env.comando_generale_id : process.env.jacopo2199o_id;
const rolesTable = argv[2] === "-real" ? cgRolesTable : jRolesTable;

const writeFile = (data, filePath) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), error => {
    if (error) throw error;
  });
};

const start = (guild, client, membersActivity) => {
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
        const message = `<@${memberActivity.id}> downgraded to <@&${previousRole.id}>`;
        await client.channels.cache.get("1100786695613456455")
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
        const message = `<@${memberActivity.id}> promoted to <@&${nextRole.id}>`;
        await client.channels.cache.get("1100786695613456455")
          .send({
            content: message,
            flags: [4096]
          });
      }
    }

    writeFile(membersActivity, filePath);
  });
};

const cooldown = 4;
const data = new SlashCommandBuilder()
  .setName("start-activity-points")
  .setDescription("set initial activity points and start monitoring");

/**
 * @param {import("discord.js").Interaction} interaction
*/
const execute = async (interaction) => {
  // setup
  await interaction.deferReply();

  const additionalPoints = {
    thirdClass: 5,
    secondClass: 50,
    firstClass: 500
  };
  const maxPoints = {
    firstClass: 7000,
    secondClass: 800,
    thirdClass: 70
  };

  // fetch new data at connection
  client = interaction.client;
  guild = client.guilds.resolve(serverId);
  const membersCollection = await guild.members.fetch();
  membersActivity = (await guild.members.fetch())
    .filter(member => member.user.id !== "1149977789496311888") // id del bot "comando generale"
    .map(member => {
      return {
        "id": member.id,
        "name": member.displayName,
        "points": 0,
        "roleId": undefined,
        "roleName": undefined
      };
    });

  // set initial members activity
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

  writeFile(membersActivity, filePath);

  dayInterval.startTime = new Date();
  start(guild, client, membersActivity);
  dayInterval.id = setInterval(start, dayMilliseconds, guild, client, membersActivity); // ricorda di aggiornarlo ogni giorno * 60 * 60

  await interaction.editReply("activity points created: start monitoring...");
};

export {
  guild,
  client,
  cooldown,
  data,
  dayInterval,
  dayMilliseconds,
  filePath,
  serverId,
  membersActivity,
  start,
  execute
};
