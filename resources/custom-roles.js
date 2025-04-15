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
    role => role.name === "membro"
  );
  await member.roles.add(
    roleMembro.id
  );
  const roleItaliano = member.guild.roles.cache.find(
    role => role.name === "italiano"
  );
  const roleEnglish = member.guild.roles.cache.find(
    role => role.name === "english"
  );
  const roleInternational = member.guild.roles.cache.find(
    role => role.name === "international"
  );

  if (
    !roleItaliano &&
    !roleEnglish &&
    !roleInternational
  ) {
    await member.roles.add(
      roleEnglish.id
    );
  } else if (
    roleItaliano &&
    roleEnglish
  ) {
    await member.roles.remove(
      roleEnglish.id
    );
  } else if (
    roleItaliano &&
    roleInternational
  ) {
    await member.roles.remove(
      roleItaliano.id
    );
  } else if (
    roleEnglish &&
    roleInternational
  ) {
    await member.roles.remove(
      roleEnglish.id
    );
  }
}

/**
* @param {import("discord.js").GuildMember} member
* @returns {import("discord.js").Role | undefined}
*/
function getCustomRole(
  member
) {
  return member.roles.cache.find(
    role => customRoles.includes(
      role.name
    )
  );
}

/**
 * @param {import("discord.js").GuildMember} member
 * @returns {import("discord.js").Collection<string, import("discord.js").Role>}
 */
function getCustomRoles(
  member
) {
  return member.roles.cache.filter(
    role => customRoles.includes(
      role.name
    ).map(
      role => role // per restituire un array invece di una collection
    )
  );
}

/**
 * @param {import("discord.js").Role} role
 * @param {Boolean} role
 * @returns {Boolean}
 */
function hasModerationRole(
  role
) {
  if (
    moderationRoles.includes(
      role.name
    ) === true
  ) {
    return true;
  } else {
    return false;
  }
}

/**
 * aggiorna il ruolo di un membro da un ruolo precedente a uno nuovo
 * @param {import("discord.js").GuildMember} member
 * @param {string} newRoleName - nome del nuovo ruolo
 * @param {string} oldRoleName - nome del vecchio ruolo
 * @returns {{ newRole: import("discord.js").Role, oldRole: import("discord.js").Role } | null}
 */
async function updateRoleTo(
  member,
  newRoleName,
  oldRoleName
) {
  const oldRole = member.guild.roles.cache.find(
    role => role.name === oldRoleName
  );
  const newRole = member.guild.roles.cache.find(
    role => role.name === newRoleName
  );

  if (
    !oldRole ||
    !newRole
  ) {
    console.error(
      `updateRoleTo: missing role(s). old role: ${oldRoleName || "undefined"}, new role: ${newRoleName || "undefined"}`
    );
    return null; // restituisce null in caso di errore
  }

  try {
    await member.roles.remove(
      oldRole.id
    );
    await member.roles.add(
      newRole.id
    );
    return {
      newRole,
      oldRole
    }; // restituisce i ruoli aggiornati
  } catch (
  __error
  ) {
    console.error(
      "updateRoleTo: failed to update roles:",
      __error.message
    );
    return null; // restituisce null in caso di errore
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

