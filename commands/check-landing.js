import { customChannels } from "../resources/custom-channels.js";
import { sendMesseges } from "../resources/general-utilities.js";

/**
 * @param {import("discord.js").Interaction} interaction
 */
const checkLanding = async (interaction) => {
  const guildMembers = await interaction.guild.members.fetch();
  const customChannel = interaction.guild.channels.cache.find((channel) => channel.name === customChannels.internal);

  let messages = [];

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
    await interaction.reply("all members registered");
  } else {
    sendMesseges(messages, customChannel);
    messages = [];
    await interaction.reply("done");
  }
};

export { checkLanding };