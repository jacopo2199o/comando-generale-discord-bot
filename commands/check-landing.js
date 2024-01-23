import { customChannels } from "../resources/custom-channels.js";
import { sendMesseges } from "../resources/general-utilities.js";

/**
 * @param {import("discord.js").Interaction} interaction
 */
const checkLanding = async (interaction) => {
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
    }
  });

  if (!messages.length) {
    await interaction.editReply("all members registered");
  } else {
    sendMesseges(messages, channel);
    await interaction.followUp("done");
  }
};

export { checkLanding };

