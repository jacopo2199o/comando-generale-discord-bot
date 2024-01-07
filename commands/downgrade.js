import { promotionPoints, globalPoints } from "../events/ready.js";
import { customRoles } from "../resources/custom-roles.js";

/**
 * @param {import("discord.js").Interaction} interaction
 */
const downgrade = async (interaction) => {
  const members = await interaction.client.guilds.resolve(interaction.guild.id)
    .members.fetch();

  let isDowngrading = false;

  await interaction.deferReply();

  members.forEach((member) => {
    member.roles.cache.forEach(async (role) => {
      const rankIndex = customRoles.findIndex((rank) => rank === role.name);

      // trovata corrispondenza col nome ruolo
      if (rankIndex !== -1) {
        const oldRank = customRoles[rankIndex];
        const newRank = customRoles[rankIndex + 1];

        isDowngrading = true;

        // alle volte l'indice potrebbe essere maggiore della lunghezza del vettore (es. ruolo membro)
        if (newRank) {
          const oldRole = interaction.guild.roles.cache.find((role) => role.name === oldRank);
          const newRole = interaction.guild.roles.cache.find((role) => role.name === newRank);

          await member.roles.remove(oldRole.id);
          await member.roles.add(newRole.id);
        }
      }
    });

    promotionPoints[member.id] = 0;
    globalPoints[member.id] = 0;
  });

  if (isDowngrading) {
    await interaction.editReply("starting monthly downgrade...");
  } else {
    await interaction.editReply("nobody to downgrade");
  }
};

export { downgrade };
