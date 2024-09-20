const customRoles = [
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
];
const moderationRoles = [
  customRoles[0],
  customRoles[1],
  customRoles[2],
  customRoles[3]
];

/**
 * @param {import("discord.js").GuildMember} member 
 */
async function addCustomBaseRoles(member) {
  if (member.user.bot === true) {
    return;
  }
  const roleMembro = member.guild.roles.cache.find((role) => {
    return role.name === "membro";
  });
  await member.roles.add(roleMembro.id);
  const roleItaliano = member.guild.roles.cache.find((role) => {
    return role.name === "italiano";
  });
  const roleEnglish = member.guild.roles.cache.find((role) => {
    return role.name === "english";
  });
  const roleInternational = member.guild.roles.cache.find((role) => {
    return role.name === "international";
  });
  if (
    roleItaliano === false &&
    roleEnglish === false && roleInternational === false
  ) {
    await member.roles.add(roleEnglish.id);
  }
  else if (
    roleItaliano !== undefined &&
    roleEnglish !== undefined
  ) {
    await member.roles.remove(roleEnglish.id);
  }
  else if (
    roleItaliano !== undefined &&
    roleInternational !== undefined
  ) {
    await member.roles.remove(roleItaliano.id);
  }
  else if (
    roleEnglish !== undefined &&
    roleInternational !== undefined
  ) {
    await member.roles.remove(roleInternational.id);
  }
}

/**
* @param {import("discord.js").GuildMember} member 
* @returns {import("discord.js").Role}
*/
function getCustomRole(member) {
  let customRole = undefined;
  member.roles.cache.forEach((role) => {
    const customRoleIndex = customRoles.findIndex((customRole) => {
      return customRole === role.name;
    });
    if (customRoleIndex !== -1) {
      customRole = role;
    }
  });
  return customRole;
}

/**
* @param {import("discord.js").GuildMember} member
*/
function hasMoreCustomRoles(member) {
  let roles = 0;
  member.roles.cache.forEach((role) => {
    customRoles.forEach((customRole) => {
      if (customRole === role.name) {
        roles++;
      }
    });
  });
  return roles > 1 ? true : false;
}

/**
 * @param {import("discord.js").Role} role
 * @param {Boolean} role
 * @returns {Boolean}
 */
function hasModerationRole(
  role,
  isResponsabile
) {
  if (
    moderationRoles.includes(role.name) === true ||
    isResponsabile === true
  ) {
    return true;
  }
  else {
    return false;
  }
}

/**
 * @param {import("discord.js").GuildMember} member 
 */
function upgrade(member) {
  /**
   * @type {import("discord.js").Role}
   */
  let newRole = undefined;
  /**
   * @type {import("discord.js").Role}
   */
  let oldRole = undefined;
  member.roles.cache.forEach(async (role) => {
    const customRoleIndex = customRoles.findIndex((customRole) => {
      return customRole === role.name;
    });
    if (customRoleIndex !== -1) {
      const newRoleName = customRoles[customRoleIndex - 1];
      const oldRoleName = customRoles[customRoleIndex];
      if (
        newRoleName !== undefined &&
        oldRoleName !== undefined
      ) {
        if (newRoleName !== "presidente") {
          newRole = member.guild.roles.cache.find((role) => {
            return role.name === newRoleName;
          });
          oldRole = member.guild.roles.cache.find((role) => {
            return role.name === oldRoleName;
          });
          if (
            newRole !== undefined &&
            oldRole !== undefined
          ) {
            await member.roles.remove(oldRole.id);
            await member.roles.add(newRole.id);
          }
        }
      }
    }
  });
  if (
    newRole !== undefined &&
    oldRole !== undefined
  ) {
    return {
      newRole,
      oldRole
    };
  }
}

/**
 * @param {import("discord.js").GuildMember} member 
 */
function downgrade(member) {
  /**
   * @type {import("discord.js").Role}
  */
  let newRole = undefined;
  /**
   * @type {import("discord.js").Role}
  */
  let oldRole = undefined;
  member.roles.cache.forEach(async (role) => {
    const customRoleIndex = customRoles.findIndex((customRole) => {
      return customRole === role.name;
    });
    if (customRoleIndex !== -1) {
      const newRoleName = customRoles[customRoleIndex + 1];
      const oldRoleName = customRoles[customRoleIndex];
      if (
        newRoleName !== undefined &&
        oldRoleName !== undefined
      ) {
        newRole = member.guild.roles.cache.find((role) => {
          return role.name === newRoleName;
        });
        oldRole = member.guild.roles.cache.find((role) => {
          return role.name === oldRoleName;
        });
        if (
          newRole !== undefined &&
          oldRole !== undefined
        ) {
          await member.roles.remove(oldRole.id);
          await member.roles.add(newRole.id);
        }
      }
    }
  });
  if (
    newRole !== undefined &&
    oldRole !== undefined
  ) {
    return {
      newRole,
      oldRole
    };
  }
}

export {
  customRoles,
  addCustomBaseRoles,
  getCustomRole,
  hasMoreCustomRoles,
  hasModerationRole,
  upgrade,
  downgrade
};

