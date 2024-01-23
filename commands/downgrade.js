import { globalPoints } from "../events/ready.js";
import { customPoints } from "../resources/custom-points.js";
import { customRoles } from "../resources/custom-roles.js";

/**
 * @param {import("discord.js").Interaction} interaction
 */
const downgrade = async (interaction) => {
  const members = await interaction.guild.members.fetch();
  
  let isDowngrading = false;

  await interaction.deferReply();

  members.forEach((member) => {
    globalPoints[member.guild.id][member.id] = customPoints.start;

    member.roles.cache.forEach(async (role) => {
      const customRoleIndex = customRoles.findIndex((customRole) => customRole === role.name);

      if (customRoleIndex !== -1) {
        const oldCustomRole = customRoles[customRoleIndex];
        const newCustomRole = customRoles[customRoleIndex + 1];

        isDowngrading = true;

        if (newCustomRole) {
          const oldRole = interaction.guild.roles.cache.find((role) => role.name === oldCustomRole);
          const newRole = interaction.guild.roles.cache.find((role) => role.name === newCustomRole);

          await member.roles.remove(oldRole.id);
          await member.roles.add(newRole.id);
        }
      }
    });
  });

  if (isDowngrading) {
    await interaction.editReply("done");
  } else {
    await interaction.editReply("nobody to downgrade");
  }
};

export { downgrade };

