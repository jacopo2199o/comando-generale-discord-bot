import {
  readFile,
  saveFile,
  sendMesseges
} from "./general-utilities.js";

/**
 * @param { import("./community.js").Community } community
 */
const Activity = function (community) {
  this.community = community;
  this.profiles = [];
  this.timeout = Object.defineProperty({
    id: undefined,
    msDuration: 4000, // correggere nel tempo reale in millisecondi di un giorno
    msStartTime: 0,
    msRemaining: 0,
    status: "not running"
  }, "millisecondsDuration", {
    writable: false,
    configurable: false
  });
};

/**
 * @param { import("discord.js").GuildMember } member
 */
Activity.prototype.addProfile = async function (member) {
  if (!this.community.settings.preferences) {
    return "preferences missing";
  }

  const messages = [];
  const role = member.guild.roles.cache.get(this.community.settings.preferences.baseRole.id);

  if (!member.roles.cache.has(this.community.settings.preferences.baseRole.id)) {
    messages.push(`welcome there, ${member.displayName}. you received ${role.name} base rank\n`);
    //member.roles.add(this.community.settings.preferences.baseRole.id);
  } else {
    messages.push(`welcome there, ${member.displayName}\n`);
  }

  if (this.timeout.status === "running") {
    // add new member into activity
    this.profiles.push(
      Object.defineProperty({
        id: member.id,
        name: member.displayName,
        points: this.community.settings.preferences.baseRole.points,
        roleId: role.id,
        roleName: role.name
      }, "id", {
        writable: false,
        configurable: false
      })
    );
  }

  sendMesseges(this.community, messages);
};

/**
 * @param { import("discord.js").Client } client
 */
Activity.prototype.initialize = async function (client) {
  if (Object.keys(this.community.settings.preferences).length === 0) {
    return "not ready";
  }

  const baseRole = this.community.settings.ranks.find(rank => rank.id === this.community.settings.preferences.baseRole.id);
  const messages = [];

  // popola il vettore degli utenti della comunità
  this.members = await client.guilds.resolve(this.community.id)
    .members.fetch();

  // popola il vettore dei gradi con almeno il grado base
  if (!baseRole) {
    this.community.settings.ranks.push(this.community.settings.preferences.baseRole);
  } else if (baseRole.points !== this.community.settings.preferences.baseRole.points) {
    baseRole.points = this.community.settings.preferences.baseRole.points;
  }

  // aggiunge il grado base ai profili che non ce l'hanno
  this.members.filter(member => !member.user.bot && member.id !== this.community.adminId)
    .forEach(member => {
      if (!member.roles.cache.has(this.community.settings.preferences.baseRole.id)) {
        messages.push(`${member.displayName} received base role ${this.community.settings.preferences.baseRole.id}\n`);
        //member.roles.add(this.community.settings.preferences.baseRole.id);
      }
    });

  // popola il vettore dei profili attività
  this.profiles = this.members.filter(member => !member.user.bot && member.id !== this.community.adminId)
    .map(member => {
      return Object.defineProperty({
        id: member.id,
        name: member.displayName,
        points: 0,
        roleId: undefined,
        roleName: undefined
      }, "id", {
        writable: false,
        configurable: false
      });
    });

  // imposta i punti iniziali
  this.members.filter(member => !member.user.bot && member.id !== this.community.adminId)
    .forEach(member => {
      member.roles.cache.forEach(role => {
        const profile = this.profiles.find(profile => profile.id === member.id);
        const rank = this.community.settings.ranks.find(rank => rank.id === role.id);
        if (profile && rank) {
          if (rank.points >= profile.points) {
            profile.points = rank.points;
            profile.roleId = role.id;
            profile.roleName = role.name;
          }
        }
      });
    });

  sendMesseges(this.community, messages);
  saveFile({
    msRemaining: this.timeout.msRemaining,
    profiles: this.profiles
  }, this.community.settings.filePaths.activity);
  saveFile(this.community.settings.ranks, this.community.settings.filePaths.ranks);
};

/**
 * @param { import("discord.js").Client } client
 */
Activity.prototype.resume = function (client) {
  if (this.timeout.status === "running") {
    return this.timeout.status;
  }

  const activity = readFile(this.community.settings.filePaths.activity);
  this.profiles = activity.profiles;
  this.timeout.msRemaining = activity.msRemaining;
  this.timeout.msStartTime = new Date().getTime();
  this.timeout.status = "running";

  this.timeout.id = setTimeout(() => {
    this.start(client);
    this.timeout.msRemaining = 0;
  }, this.timeout.msRemaining);
};

/**
 * @param { import("discord.js").Channel } logChannel
 * @param { import("discord.js").Role } baseRole
 * @param { Number } points
 */
Activity.prototype.setPreferences = function (logChannel, baseRole, points) {
  if (this.timeout.status === "running") {
    return this.status.timeout;
  }

  this.community.settings.preferences = {
    logChannelId: logChannel.id,
    baseRole: {
      id: baseRole.id,
      name: baseRole.name,
      points
    }
  };

  saveFile(this.community.settings.preferences, this.community.settings.filePaths.preferences);
};

/**
 * @param {import("discord.js").Role} role 
 */
Activity.prototype.setRank = function (role, points) {
  if (!this.community.settings.preferences) {
    return "preferences missing";
  }

  if (this.timeout.status === "running") {
    return this.timeout.status;
  }

  if (this.community.settings.preferences.baseRole.points >= points) {
    return "greater equal base points";
  }

  if (this.community.settings.ranks.find(rank => rank.points === points)) {
    return "equal points";
  }

  if (this.community.settings.ranks.find(rank => rank.id === role.id)) {
    return "equal role";
  }

  this.community.settings.ranks.push({
    id: role.id,
    name: role.name,
    points: points
  });
  this.community.settings.ranks.sort((a, b) => b.points - a.points);

  saveFile(this.community.settings.ranks, this.community.settings.filePaths.ranks);
};

/**
 * @param { import("discord.js").Client } client
 */
Activity.prototype.start = async function (client) {
  // imposta la data di avvio e attiva il timer
  if (this.timeout.status === "not running") {
    this.timeout.msStartTime = new Date().getTime();
    this.timeout.status = "running";
    this.timeout.id = setTimeout(() => this.start(client), this.timeout.msDuration);
    return this.timeout.status;
  }

  const messages = [];

  this.timeout.msRemaining = this.timeout.msDuration;
  this.timeout.msStartTime = new Date().getTime();

  this.profiles.forEach((profile) => {
    // sottrai punti
    if (profile.points > 0) {
      profile.points -= 1;
    }

    //const member = this.community.guild.members.cache.find(member => member.id === profile.id);
    const rank = ((ranks, roleId) => {
      const index = ranks.findIndex(rank => rank.id === roleId);
      //const index = ranks.findIndex(rank => rank.points === profile.points);
      if (index !== -1) {
        return Object.freeze({
          next: this.community.settings.ranks[index - 1],
          actual: this.community.settings.ranks[index],
          previous: this.community.settings.ranks[index + 1]
        });
      }
    })(this.community.settings.ranks, profile.roleId);

    // aggiorna i ruoli
    if (rank) {
      if (rank.previous && rank.actual) {
        if (profile.points <= rank.previous.points) {
          // member.roles.remove(actualRole.id);
          // member.roles.add(previousRole.id);
          profile.roleId = rank.previous.id;
          profile.roleName = client.guilds.resolve(this.community.id)
            .roles.cache.get(rank.previous.id)
            .name;
          messages.push(`<@${profile.id}> downgraded to *${rank.previous.name}*\n`);
        }
      } else if (rank.next && rank.actual) {
        if (profile.points >= rank.next.points) {
          // member.roles.remove(actualRole.id);
          // member.roles.add(nextRole.id);
          profile.roleId = rank.next.id;
          profile.roleName = client.guilds.resolve(this.community.id)
            .roles.cache.get(rank.next.id)
            .name;
          messages.push(`<@${profile.id}> promoted to *${rank.next.name}*\n`);
        }
      }
    }
  });

  sendMesseges(this.community, messages);

  saveFile({
    msRemaining: this.timeout.msRemaining,
    profiles: this.profiles
  }, this.community.settings.filePaths.activity);

  this.timeout.id = setTimeout(() => this.start(client), this.timeout.msDuration);
};

Activity.prototype.stop = async function () {
  if (this.timeout.status === "not running") {
    return this.timeout.status;
  }

  this.timeout.msRemaining = new Date().getTime() - this.timeout.msStartTime;
  this.timeout.msStartTime = null;
  this.timeout.status = "not running";
  this.timeout.id = clearTimeout(this.timeout.id);

  saveFile({
    msRemaining: this.timeout.msRemaining,
    profiles: this.profiles
  }, this.community.settings.filePaths.activity);
};

/**
 * @param { import("discord.js").GuildMember } member
 * @param { Number } amount
 */
Activity.prototype.takePoint = function (member, amount) {
  const profile = this.profiles.find(profile => profile.id === member.id);

  if (this.timeout.status === "not running") {
    return this.timeout.status;
  }

  if (member.id === this.community.adminId) {
    return "administrator";
  }

  if (!profile) {
    return "not found";
  }

  profile.points += amount;

  saveFile({
    msRemaining: this.timeout.msRemaining,
    profiles: this.profiles
  }, this.community.settings.filePaths.activity);
};

export { Activity };