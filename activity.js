import fs from "node:fs";
import { saveFile } from "./general-utilities.js";

/**
 * @param {import("discord.js").Client} client
*/
const Activity = function () {
  this.additionalPoints = Object.freeze({
    firstClass: 500,
    secondClass: 50,
    thirdClass: 5
  });
  this.dayInterval = Object.defineProperty({
    id: undefined,
    millisecondsDuration: 1000, // correggere nel tempo reale in millisecondi di un giorno
    millisecondsStartTime: undefined,
    millisecondsRemaining: undefined
  }, "millisecondsDuration", {
    writable: false,
    configurable: false
  });
  this.filePath = "./resources/activity-points.json";
  this.maxPoints = Object.freeze({
    firstClass: 8000,
    secondClass: 800,
    thirdClass: 80
  });
  this.pointsDecay = Object.freeze({
    low: 1,
    moderate: 2,
    high: 4
  });
  this.profiles = [];

  Object.defineProperty(this,
    "filePath",
    {
      writable: false,
      configurable: false
    });
};

/**
 * @param { import("discord.js").GuildMember } member
 */
Activity.prototype.addPoints = function (member, amount) {
  if (this.dayInterval.millisecondsStartTime) {
    const profile = this.profiles.find(profile => profile.id === member.id);
    profile.points += amount;

    saveFile(this.profiles, this.filePath);
    return "success";
  }
};

/**
 * @param { import("discord.js").GuildMember } member
 */
Activity.prototype.addProfile = function (member, baseRole) {
  if (this.dayInterval.id) {
    const role = member.guild.roles.cache.get(baseRole.id);

    // add new member into activity
    this.profiles.push(
      Object.defineProperties({
        id: member.id,
        name: member.displayName,
        points: baseRole.points + this.additionalPoints.thirdClass,
        roleId: role.id,
        roleName: role.name
      }, {
        id: {
          writable: false,
          configurable: false
        },
        name: {
          writable: false,
          configurable: false
        }
      }));
  }

};

/**
 * @param { import("discord.js").Client } client
 * @param { import("./events/ready.js").community } community
 */
Activity.prototype.initialize = async function (community, client) {
  this.guild = await client.guilds.resolve(community.id);
  this.members = await client.guilds.resolve(community.id)
    .members.fetch();

  // popola il vettore dei profili attività
  this.profiles = this.members.filter(member => member.user.id !== process.env.client_id)
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

  // imposta i punti iniziali
  this.members.forEach(member => {
    const profile = this.profiles.find(profile => profile.id === member.id);
    if (profile) {
      member.roles.cache.forEach(role => {
        const rank = community.ranks.find(rank => rank.id === role.id);
        if (
          rank &&
          rank.points >= profile.points
        ) {
          if (rank.points <= this.maxPoints.thirdClass) {
            profile.points = rank.points + this.additionalPoints.thirdClass;
          } else if (rank.points <= this.maxPoints.secondClass) {
            profile.points = rank.points + this.additionalPoints.secondClass;
          } else if (rank.points <= this.maxPoints.firstClass) {
            profile.points = rank.points + this.additionalPoints.firstClass;
          }
          profile.roleId = role.id;
          profile.roleName = role.name;
        }
      });
    }
  });

  saveFile(this.profiles, this.filePath);
};

/**
 * @param { import("discord.js").Client } client
 * @param { import("./events/ready.js").community } community
 */
Activity.prototype.resume = function (community, client) {
  if (this.dayInterval.id) {
    return "not stopped";
  }

  this.profiles = ((path) => {
    const data = fs.readFileSync(path);
    return JSON.parse(data);
  })(this.filePath);

  this.dayInterval.millisecondsRemaining = null;
  this.dayInterval.millisecondsStartTime = new Date();

  setTimeout(() => {
    this.start(community, client);
    this.dayInterval.id = setInterval(() => this.start(community, client), this.dayInterval.millisecondsDuration);
  }, this.dayInterval.millisecondsRemaining);
};

/**
 * @param { import("discord.js").Client } client
 * @param { import("./events/ready.js").community } community
 */
Activity.prototype.start = function (community, client) { //client serve solo per inviare i messaggi (per ora)
  // imposta la data di avvio e attiva il timer
  if (!this.dayInterval.millisecondsStartTime) {
    this.dayInterval.millisecondsStartTime = new Date();
    this.dayInterval.id = setInterval(() => this.start(community, client), this.dayInterval.millisecondsDuration);
    return "not stopped";
  }

  this.profiles.forEach(async (profile) => {
    // const guildMember = this.guild.members.cache.find(guildMember => guildMember.id === memberActivity.id);
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
        profile.points -= this.pointsDecay.low;
      } else if (profile.points <= 800) {
        profile.points -= this.pointsDecay.moderate;
      } else if (profile.points <= 7000) {
        profile.points -= this.pointsDecay.high;
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
      profile.roleName = this.guild.roles.cache.get(rank.previous.id).name;

      // i messaggi dovranno essere pubblicati nell'apposito evento
      const message = `<@${profile.id}> downgraded to <@&${rank.previous.id}>`;
      await client.channels.cache.get(community.room)
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
      profile.roleName = this.guild.roles.cache.get(rank.next.id).name;

      // i messaggi dovranno essere pubblicati nell'apposito evento
      const message = `<@${profile.id}> promoted to <@&${rank.next.id}>`;
      await client.channels.cache.get(community.room)
        .send({
          content: message,
          flags: [4096]
        });
    }
  });

  saveFile(this.profiles, this.filePath);
};

Activity.prototype.stop = async function () {
  if (!this.dayInterval.id) {
    return "not started";
  }

  this.dayInterval.millisecondsRemaining = new Date() - this.dayInterval.millisecondsStartTime;
  this.dayInterval.millisecondsStartTime = null;
  this.dayInterval.id = clearInterval(this.dayInterval.id);

  saveFile(this.profiles, this.filePath);
};

export {
  Activity
};