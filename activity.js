import fs from "node:fs";
import { saveFile, splitMessages } from "./general-utilities.js";

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
  this.dayTimeout = Object.defineProperty({
    id: undefined,
    millisecondsDuration: 2000, // correggere nel tempo reale in millisecondi di un giorno
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
};

/**
 * @param { import("discord.js").GuildMember } member
 * @param { Number } amount
 */
Activity.prototype.addPoints = function (member, amount) {
  if (this.dayTimeout.millisecondsStartTime) {
    const profile = this.profiles.find(profile => profile.id === member.id);
    profile.points += amount;

    saveFile(this.profiles, this.filePath);
    return "success";
  }
};

/**
 * @param { import("discord.js").GuildMember } member
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

  if (this.dayTimeout.id) {
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
 * @param { import("discord.js").Client } client
 */
Activity.prototype.initialize = async function (client) {
  if (!this.community.settings) {
    return "not ready";
  }

  this.members = await client.guilds.resolve(this.community.id)
    .members.fetch();

  // popola il vettore dei profili attività
  this.profiles = this.members.filter(member => !member.user.bot && member.id !== this.community.adminId)
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
        const rank = this.community.settings.ranks.find(rank => rank.id === role.id);
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

  saveFile(this.profiles, this.community.settings.filePaths.activity);
};

/**
 * @param { import("discord.js").Client } client
 */
Activity.prototype.resume = function (client) {
  if (!this.dayTimeout.id) {
    return "not started";
  }

  if (this.dayTimeout.millisecondsStartTime !== null) {
    return "not stopped";
  }

  this.profiles = ((path) => {
    const data = fs.readFileSync(path);
    return JSON.parse(data);
  })(this.community.settings.filePaths.activity);

  this.dayTimeout.millisecondsStartTime = new Date();

  setTimeout(() => {
    this.start(client);
    this.dayTimeout.millisecondsRemaining = null;
    this.dayTimeout.id = setTimeout(() => this.start(client), this.dayTimeout.millisecondsDuration);
  }, this.dayTimeout.millisecondsRemaining);
};

/**
 * @param { import("discord.js").Channel } logChannel
 * @param { import("discord.js").Role } baseRole
 * @param { Number } startPoints
 */
Activity.prototype.setPreferences = function (logChannel, baseRole, startPoints) {
  this.community.settings.preferences = {
    logChannelId: logChannel.id,
    baseRole: {
      id: baseRole.id,
      points: startPoints
    }
  };

  this.community.settings.ranks = [{
    id: baseRole.id,
    points: startPoints
  }];

  saveFile(this.community.settings.preferences, this.community.settings.filePaths.preferences);
  saveFile(this.community.settings.ranks, this.community.settings.filePaths.ranks);

  return "success";
};

/**
 * @param {import("discord.js").Role} role 
 */
Activity.prototype.setRank = function (role, points) {
  if (!this.community.settings.preferences) {
    if (this.community.settings.preferences.baseRole.points <= points) {
      return "points minor equal";
    }
    return "preferences missing";
  }

  if (!this.community.settings.ranks) {
    this.community.settings.ranks = [];
  }

  this.community.settings.ranks.push({
    id: role.id,
    points
  });

  saveFile(this.community.settings.ranks, this.community.settings.filePaths.ranks);
};

/**
 * @param { import("discord.js").Client } client
 */
Activity.prototype.start = async function (client) {
  let messages = [];

  // imposta la data di avvio e attiva il timer
  if (!this.dayTimeout.millisecondsStartTime) {
    this.dayTimeout.millisecondsStartTime = new Date();
    this.dayTimeout.id = setTimeout(() => this.start(client), this.dayTimeout.millisecondsDuration);
    return "not stopped";
  }

  this.profiles.forEach((profile) => {
    //const member = this.community.guild.members.cache.find(member => member.id === profile.id);
    const rank = ((ranks, roleId) => {
      const index = ranks.findIndex(rank => rank.id === roleId);
      return Object.freeze({
        next: ranks[index - 1],
        actual: ranks[index],
        previous: ranks[index + 1],
      });
    })(this.community.settings.ranks, profile.roleId);

    // sottrai punti in quantità diversa in base al progresso
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
    if (rank.previous
      && rank.actual
      && profile.points < rank.actual.points
    ) {
      // member.roles.remove(actualRole.id);
      // member.roles.add(previousRole.id);
      profile.roleId = rank.previous.id;
      profile.roleName = client.guilds.resolve(this.community.id)
        .roles.cache.get(rank.previous.id)
        .name;

      messages.push(`<@${profile.id}> downgraded to <@&${rank.previous.id}>\n`);
    } else if (rank.next
      && rank.actual
      && profile.points >= rank.next.points
    ) {
      // member.roles.remove(actualRole.id);
      // member.roles.add(nextRole.id);
      profile.roleId = rank.next.id;
      profile.roleName = client.guilds.resolve(this.community.id)
        .roles.cache.get(rank.previous.id)
        .name;

      messages.push(`<@${profile.id}> downgraded to <@&${rank.previous.id}>\n`);
    }
  });

  if (messages) {
    let chunks = splitMessages(messages, 2000);

    for (let chunk of chunks){
      await client.channels.cache.get(this.community.settings.preferences.logChannelId)
        .send({
          content: chunk,
          flags: [4096]
        });
    }
    messages = [];
    chunks = null;
  }

  saveFile(this.profiles, this.community.settings.filePaths.activity);

  this.dayTimeout.id = setTimeout(() => this.start(client), this.dayTimeout.millisecondsDuration);
};

Activity.prototype.stop = async function () {
  if (!this.dayTimeout.id) {
    return "not started";
  }

  this.dayTimeout.millisecondsRemaining = new Date() - this.dayTimeout.millisecondsStartTime;
  this.dayTimeout.millisecondsStartTime = null;
  this.dayTimeout.id = clearTimeout(this.dayTimeout.id);

  saveFile(this.profiles, this.community.settings.filePaths.activity);
};

export { Activity };