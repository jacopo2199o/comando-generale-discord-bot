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

  member.roles.cache.forEach(
    async (role) => {
      const customRoleIndex = customRoles.findIndex((rank) => rank === role.name);

      if (customRoleIndex !== -1) {
        const newRoleName = customRoles[customRoleIndex + 1];
        const oldRoleName = customRoles[customRoleIndex];

        if (newRoleName !== undefined && oldRoleName !== undefined) {
          newRole = member.guild.roles.cache.find((role) => role.name === newRoleName);
          oldRole = member.guild.roles.cache.find((role) => role.name === oldRoleName);

          if (newRole !== undefined && oldRole !== undefined) {
            await member.roles.remove(oldRole.id);
            await member.roles.add(newRole.id);
          }
        }
      }
    }
  );

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

  member.roles.cache.forEach(
    async (role) => {
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
    }
  );

  if (newRole !== undefined) {
    return {
      newRole,
      oldRole
    };
  } else {
    return undefined;
  }
};

export {
  customRoles,
  downgrade,
  upgrade
};

