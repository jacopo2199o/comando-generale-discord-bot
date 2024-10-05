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
const pointsRole = {
  "presidente": 23000,
  "ministro": 22000,
  "senatore": 21000,
  "governatore": 20000,
  "prefetto": 19000,
  "sottoprefetto": 18000,
  "segretario": 17000,
  "sottosegretario": 16000,
  "principale": 15000,
  "dirigente": 14000,
  "coordinatore capo": 13000,
  "coordinatore": 12000,
  "sovrintendente capo": 11000,
  "sovrintendente": 10000,
  "assistente capo": 9000,
  "assistente": 8000,
  "gran generale": 7000,
  "generale": 6000,
  "gran colonnello": 5000,
  "colonnello": 4000,
  "gran comandante": 3000,
  "comandante": 2000,
  "tenente": 1000,
  "membro": 0
};

/**
 * @param {import("discord.js").GuildMember} member 
 */
async function addCustomBaseRoles(
  member
) {
  if (
    member.user.bot === true
  ) {
    return;
  }
  const roleMembro = member.guild.roles.cache.find(
    function (
      role
    ) {
      return role.name === "membro";
    }
  );
  await member.roles.add(
    roleMembro.id
  );
  const roleItaliano = member.guild.roles.cache.find(
    function (
      role
    ) {
      return role.name === "italiano";
    }
  );
  const roleEnglish = member.guild.roles.cache.find(
    function (
      role
    ) {
      return role.name === "english";
    }
  );
  const roleInternational = member.guild.roles.cache.find(
    function (
      role
    ) {
      return role.name === "international";
    }
  );
  if (
    roleItaliano === undefined &&
    roleEnglish === undefined &&
    roleInternational === undefined
  ) {
    await member.roles.add(
      roleEnglish.id
    );
  } else if (
    roleItaliano !== undefined &&
    roleEnglish !== undefined
  ) {
    await member.roles.remove(
      roleEnglish.id
    );
  } else if (
    roleItaliano !== undefined &&
    roleInternational !== undefined
  ) {
    await member.roles.remove(
      roleItaliano.id
    );
  } else if (
    roleEnglish !== undefined &&
    roleInternational !== undefined
  ) {
    await member.roles.remove(
      roleInternational.id
    );
  }
}

/**
* @param {import("discord.js").GuildMember} member 
* @returns {import("discord.js").Role}
*/
function getCustomRole(
  member
) {
  let result = undefined;
  member.roles.cache.forEach(
    function (
      role
    ) {
      customRoles.forEach(
        function (
          customRole
        ) {
          if (
            role.name === customRole
          ) {
            result = role;
          }
        }
      );
    }
  );
  return result;
}

/**
* @param {import("discord.js").GuildMember} member
*/
function getCustomRoles(
  member
) {
  let result = [];
  member.roles.cache.forEach(
    function (
      role
    ) {
      customRoles.forEach(
        function (
          customRole
        ) {
          if (
            role.name === customRole
          ) {
            result.push(
              role
            );
          }
        }
      );
    }
  );
  return result;
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
    moderationRoles.includes(
      role.name
    ) === true ||
    isResponsabile === true
  ) {
    return true;
  } else {
    return false;
  }
}

/**
 * @param {import("discord.js").GuildMember} member 
 */
async function updateRoleTo(
  member,
  newRoleName,
  oldRoleName
) {
  const oldRole = member.guild.roles.cache.find(
    function (
      role
    ) {
      return role.name === oldRoleName;
    }
  );
  const newRole = member.guild.roles.cache.find(
    function (
      role
    ) {
      return role.name === newRoleName;
    }
  );
  await member.roles.remove(
    oldRole?.id
  );
  await member.roles.add(
    newRole?.id
  );
  if (
    oldRole !== undefined &&
    newRole !== undefined
  ) {
    return {
      newRole,
      oldRole
    };
  } else {
    console.error("update member role to: new role or old role undefined");
  }
}

export {
  customRoles,
  pointsRole,
  addCustomBaseRoles,
  getCustomRole,
  getCustomRoles,
  hasModerationRole,
  updateRoleTo
};

