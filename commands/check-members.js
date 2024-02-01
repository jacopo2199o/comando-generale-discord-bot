import { customChannels } from "../resources/custom-channels.js";
import { sendMesseges } from "../resources/general-utilities.js";

/**
 * @param {import("discord.js").Interaction} interaction
 */
const checkMembers = async (interaction) => {
  await interaction.deferReply();
  const members = await interaction.guild.members.fetch();

  let messages = [];
  members.forEach((member) => {
    if (member.user.bot === false) {
      if (!member.roles.cache.has((role) => role.name === "italiano")) {
        if (!member.roles.cache.has((role) => role.name === "international")) {
          messages.push(`member with missing language role: *${member.displayName}, ${member.nickname}, ${member.user.username}*\n`);
        }
      }

      if (member.roles.cache.has((role) => role.name === "italiano")) {
        if (member.roles.cache.has((role) => role.name === "international")) {
          messages.push(`member with *italiano* and *international* role: *${member.displayName}, ${member.nickname}, ${member.user.username}*\n`);
        }
      }
    }
  });

  if (messages.length > 0) {
    const channel = interaction.guild.channels.cache.find((channel) => channel.name === customChannels.internal)
      || interaction.guild.channels.cache.get(interaction.guild.publicUpdatesChannelId);
    sendMesseges(messages, channel);
    await interaction.followUp("done");
  } else {
    await interaction.editReply("no problems found");
  }
};

export { checkMembers };

