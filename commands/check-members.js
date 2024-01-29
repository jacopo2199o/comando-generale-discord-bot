import { globalPoints } from "../events/ready.js";
import { customChannels } from "../resources/custom-channels.js";
import { getCustomRole } from "../resources/custom-roles.js";
import { sendMesseges } from "../resources/general-utilities.js";

/**
 * @param {import("discord.js").Interaction} interaction
 */
const checkMembers = async (interaction) => {
  const members = await interaction.guild.members.fetch();
  const channel = interaction.guild.channels.cache.find((channel) => channel.name === customChannels.internal)
    || interaction.guild.channels.cache.get(interaction.guild.publicUpdatesChannelId);

  let messages = [];

  await interaction.deferReply();

  members.forEach((member) => {
    if (!member.user.bot) {
      if (!member.roles.cache.some((role) => role.name === "italiano")) {
        if (!member.roles.cache.some((role) => role.name === "international")) {
          messages.push(`member with missing language role: *${member.displayName}, ${member.nickname}, ${member.user.username}*\n`);
        }
      }

      if (member.roles.cache.some((role) => role.name === "italiano")) {
        if (member.roles.cache.some((role) => role.name === "international")) {
          messages.push(`member with *italiano* and *international* role: *${member.displayName}, ${member.nickname}, ${member.user.username}*\n`);
        }
      }

      if (globalPoints[interaction.guild.id][interaction.member.id] === 0) {
        const customRole = getCustomRole(member);

        if (customRole.name !== "membro") {
          messages.push(`${member.displayName} has ${customRole.name} with 0 *promotion points*`);
        }
      }
    }
  });

  if (!messages.length) {
    await interaction.editReply("no problems found");
  } else {
    sendMesseges(messages, channel);
    await interaction.followUp("done");
  }
};

export { checkMembers };

