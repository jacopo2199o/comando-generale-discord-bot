import fs from "node:fs";
import { saveFile } from "./general-utilities.js";

/**
 * @param { import("./community.js").Community } community
 */
const Activity = function (community) {
  this.additionalPoints = Object.freeze({
    firstClass: 500,
    secondClass: 50,
    thirdClass: 5
  });
  this.community = community;
  this.dayInterval = Object.defineProperty({
    id: undefined,
    millisecondsDuration: 1000, // correggere nel tempo reale in millisecondi di un giorno
    millisecondsStartTime: undefined,
    millisecondsRemaining: undefined
  }, "millisecondsDuration", {
    writable: false,
    configurable: false
  });
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
 * @param { Number } amount
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
 * @param { String } baseRole
 */
Activity.prototype.addProfile = async function (member) {
  if (!this.community.settings) {
    return;
  }

  if (!member.roles.cache.has(this.community.settings.preferences.baseRoleId)) {
    member.roles.add(this.community.settings.preferences.baseRoleId);
  }

  await member.guild.channels.cache.get(this.community.settings.preferences.logRoom)
    .send(`welcome there, ${member.displayName}`);

  if (this.dayInterval.id) {
    const role = member.guild.roles.cache.get(this.community.settings.preferences.baseRole.id);

    // add new member into activity
    this.profiles.push(
      Object.defineProperties({
        id: member.id,
        name: member.displayName,
        points: this.community.settings.preferences.baseRole.points + this.additionalPoints.thirdClass,
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
 * @param { import("discord.js").Guild } guild
 * @param { import("discord.js").Client } client
 */
Activity.prototype.initialize = async function (client) {
  if (!this.community.settings) {
    return "not ready";
  }

  this.members = await client.guilds.resolve(this.community.id)
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
        const rank = this.community.ranks.find(rank => rank.id === role.id);
        if (rank && rank.points >= profile.points) {
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
 */
Activity.prototype.resume = function (client) {
  if (this.dayInterval.id) {
    return "not stopped";
  }

  this.profiles = ((path) => {
    const data = fs.readFileSync(path);
    return JSON.parse(data);
  })(this.community.settings.filePaths.activity);

  this.dayInterval.millisecondsRemaining = null;
  this.dayInterval.millisecondsStartTime = new Date();

  setTimeout(() => {
    this.start(client);
    this.dayInterval.id = setInterval(() => this.start(client), this.dayInterval.millisecondsDuration);
  }, this.dayInterval.millisecondsRemaining);
};

/**
 * @param { import("discord.js").Client } client
 */
Activity.prototype.start = function (client) { //client serve solo per inviare i messaggi (per ora)
  // imposta la data di avvio e attiva il timer
  if (!this.dayInterval.millisecondsStartTime) {
    this.dayInterval.millisecondsStartTime = new Date();
    this.dayInterval.id = setInterval(() => this.start(client), this.dayInterval.millisecondsDuration);
    return "not stopped";
  }

  this.profiles.forEach(async (profile) => {
    //const member = this.community.guild.members.cache.find(member => member.id === profile.id);
    const rank = ((ranks, roleId) => {
      const index = ranks.findIndex(rank => rank.id === roleId);
      return Object.freeze({
        next: ranks[index - 1],
        actual: ranks[index],
        previous: ranks[index + 1],
      });
    })(this.community.settings.ranks, profile.roleId);

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

    // aggiorna i ruoli
    if (rank.previous && profile.points < rank.actual.points) {
      // member.roles.remove(actualRole.id);
      // member.roles.add(previousRole.id);
      profile.roleId = rank.previous.id;
      profile.roleName = this.guild.roles.cache.get(rank.previous.id).name;

      // i messaggi dovranno essere pubblicati nell'apposito evento
      const message = `<@${profile.id}> downgraded to <@&${rank.previous.id}>`;
      await client.channels.cache.get(this.community.settings.preferences.logRoom)
        .send({
          content: message,
          flags: [4096]
        });
    } else if (
      rank.next &&
      profile.points >= rank.next.points
    ) {
      // member.roles.remove(actualRole.id);
      // member.roles.add(nextRole.id);
      profile.roleId = rank.next.id;
      profile.roleName = this.guild.roles.cache.get(rank.next.id).name;

      // invia la notifica nei canali predefiniti
      const message = `<@${profile.id}> promoted to <@&${rank.next.id}>`;
      await client.channels.cache.get(this.community.settings.preferences.logRoom)
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

export { Activity };