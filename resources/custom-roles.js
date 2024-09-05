const customRoles = Object.freeze([
  "presidente",
  "ministro",
  "senatore",
  "governatore",
  "prefetto",
  "sottoprefetto",
  "segretario",
  "sottosegretario",
  "principale",
  "dirigente",
  "coordinatore capo",
  "coordinatore",
  "sovrintendente capo",
  "sovrintendente",
  "assistente capo",
  "assistente",
  "gran generale",
  "generale",
  "gran colonnello",
  "colonnello",
  "gran comandante",
  "comandante",
  "tenente",
  "membro"
]);

/**
 * @param {import("discord.js").GuildMember} member 
 */
const addCustomBaseRoles = async (member) => {
  if (member.user.bot === false) {
    const roleMembro = member.guild.roles.cache.find((role) => role.name === "membro");    
    await member.roles.add(roleMembro.id);
    const roleItaliano = member.guild.roles.cache.find((role) => role.name === "italiano");
    const roleEnglish = member.guild.roles.cache.find((role) => role.name === "english");
    const roleInternational = member.guild.roles.cache.find((role) => role.name === "international");
    const hasRoleItaliano = member.roles.cache.has((role) => role.name === "italiano");
    const hasRoleEnglish = member.roles.cache.has((role) => role.name === "english");
    const hasRoleInternational = member.roles.cache.has((role) => role.name === "international");
    if (hasRoleItaliano === false && hasRoleEnglish === false && hasRoleInternational === false) {
      await member.roles.add(roleEnglish.id);
    } else if (hasRoleItaliano === true && hasRoleEnglish === true) {
      await member.roles.remove(roleEnglish.id);
    } else if (hasRoleItaliano === true && hasRoleInternational === true) {
      await member.roles.remove(roleItaliano.id);
    } else if (hasRoleEnglish === true && hasRoleInternational === true) {
      await member.roles.remove(roleInternational.id);
    }
  }
};

/**
 * @param {import("discord.js").GuildMember} member 
 */
const downgrade = (member) => {
  /**
   * @type {import("discord.js").Role}
  */
  let newRole = undefined;
  /**
   * @type {import("discord.js").Role}
  */
  let oldRole = undefined;

  member.roles.cache.forEach(async (role) => {
    const customRoleIndex = customRoles.findIndex((customRole) => customRole === role.name);

    if (customRoleIndex !== -1) {
      const newRoleName = customRoles[customRoleIndex + 1];
      const oldRoleName = customRoles[customRoleIndex];

      if (newRoleName !== undefined && oldRoleName !== undefined) {
        newRole = member.guild.roles.cache.find(
          (role) => {
            return role.name === newRoleName;
          }
        );
        oldRole = member.guild.roles.cache.find(
          (role) => {
            return role.name === oldRoleName;
          }
        );

        if (newRole !== undefined && oldRole !== undefined) {
          await member.roles.remove(oldRole.id);
          await member.roles.add(newRole.id);
        }
      }
    }
  });

  if (newRole !== undefined && oldRole !== undefined) {
    return {
      newRole,
      oldRole
    };
  } else {
    return undefined;
  }
};

/**
* @param {import("discord.js").GuildMember} member 
* @returns {import("discord.js").Role}
*/
const getCustomRole = (member) => {
  let customRole = undefined;

  member.roles.cache.forEach((role) => {
    const customRoleIndex = customRoles.findIndex((customRole) => customRole === role.name);

    if (customRoleIndex !== -1) {
      customRole = role;
    }
  });

  return customRole;
};

/**
* @param {import("discord.js").GuildMember} member
*/
const hasMoreCustomRoles = (member) => {
  let roles = 0;
  member.roles.cache.forEach((role) => customRoles.find((customRole) => {
    if (customRole === role.name) {
      roles++;
    }
  }));
  return roles > 1 ? true : false;
};

/**
 * @param {import("discord.js").Role} role
 * @param {Boolean} role
 * @returns {Boolean}
 */
const hasModerationRole = (role, isResponsabile) => {
  if (role.name === "presidente" || role.name === "ministro") {
    return true;
  } else if (role.name === "senatore" || role.name === "governatore") {
    return true;
  } else if (isResponsabile === true) {
    return true;
  } else {
    return false;
  }
};

/**
 * @param {import("discord.js").GuildMember} member 
 */
const upgrade = (member) => {
  /**
   * @type {import("discord.js").Role}
   */
  let newRole = undefined;
  /**
   * @type {import("discord.js").Role}
   */
  let oldRole = undefined;

  member.roles.cache.forEach(async (role) => {
    const customRoleIndex = customRoles.findIndex((customRole) => customRole === role.name);

    if (customRoleIndex !== -1) {
      const newRoleName = customRoles[customRoleIndex - 1];
      const oldRoleName = customRoles[customRoleIndex];

      if (newRoleName !== undefined && oldRoleName !== undefined) {
        if (newRoleName !== "presidente") {
          newRole = member.guild.roles.cache.find((role) => role.name === newRoleName);
          oldRole = member.guild.roles.cache.find((role) => role.name === oldRoleName);

          if (newRole !== undefined && oldRole !== undefined) {
            await member.roles.remove(oldRole.id);
            await member.roles.add(newRole.id);
          }
        }
      }
    }
  });

  if (newRole !== undefined && oldRole !== undefined) {
    return {
      newRole,
      oldRole
    };
  } else {
    return undefined;
  }
};

export {
  addCustomBaseRoles,
  customRoles,
  downgrade,
  getCustomRole,
  hasModerationRole,
  hasMoreCustomRoles,
  upgrade
};

