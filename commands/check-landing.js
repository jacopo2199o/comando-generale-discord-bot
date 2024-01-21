import { customChannels } from "../resources/custom-channels.js";
import { sendMesseges } from "../resources/general-utilities.js";

/**
 * @param {import("discord.js").Interaction} interaction
 */
const checkLanding = async (interaction) => {
  const guildMembers = await interaction.guild.members.fetch();
  const channel = interaction.guild.channels.cache.find((channel) => channel.name === customChannels.internal)
    || interaction.guild.channels.cache.get(interaction.guild.publicUpdatesChannelId);

  let messages = [];

  await interaction.deferReply();

  guildMembers.forEach((guildMember) => {
    if (!guildMember.user.bot) {
      if (!guildMember.roles.cache.some((role) => role.name === "italiano")) {
        if (!guildMember.roles.cache.some((role) => role.name === "international")) {
          messages.push(`member with missing language role: *${guildMember.displayName}, ${guildMember.nickname}, ${guildMember.user.username}*\n`);
        }
      }

      if (guildMember.roles.cache.some((role) => role.name === "italiano")) {
        if (guildMember.roles.cache.some((role) => role.name === "international")) {
          messages.push(`member with *italiano* and *international* role: *${guildMember.displayName}, ${guildMember.nickname}, ${guildMember.user.username}*\n`);
        }
      }
    }
  });

  if (!messages.length) {
    await interaction.editReply("all members registered");
  } else {
    sendMesseges(messages, channel);
    await interaction.editReply("done");
  }
};

export { checkLanding };

