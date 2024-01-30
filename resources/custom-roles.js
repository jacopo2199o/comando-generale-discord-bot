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
    const roleInternational = member.guild.roles.cache.find((role) => role.name === "international");
    const hasRoleInternational = member.roles.cache.has((role) => role.name === "international");
    const hasRoleItaliano = member.roles.cache.has((role) => role.name === "italiano");

    await member.roles.add(roleMembro.id);

    if (hasRoleInternational === false && hasRoleItaliano === false) {
      await member.roles.add(roleInternational.id);
    } else if (hasRoleInternational === true && hasRoleItaliano === true) {
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

  if (member !== undefined) {
    member.roles.cache.forEach((role) => {
      const customRoleIndex = customRoles.findIndex((customRole) => customRole === role.name);

      if (customRoleIndex !== -1) {
        customRole = role;
      }
    });
  }

  return customRole;
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
  upgrade
};

