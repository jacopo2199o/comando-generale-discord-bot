import { customChannels } from "../resources/custom-channels.js";
import { hasMoreCustomRoles } from "../resources/custom-roles.js";
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
      const isMember = member.roles.cache.has((role) => role.name === "membro");
      if (isMember === true && hasMoreCustomRoles(member) === true) {
        const roleMember = member.roles.cache.get((role) => role.name === "membro");
        member.roles.remove(roleMember);
      }
      const isItaliano = member.roles.cache.has((role) => role.name === "italiano");
      const isEnglish = member.roles.cache.has((role) => role.name === "english");
      const isInternational = member.roles.cache.has((role) => role.name === "international");
      if (isItaliano === false && isEnglish === false && isInternational === false) {
        messages.push(`member with missing language role: *${member.displayName}, ${member.nickname}, ${member.user.username}*\n`);
      }
      if (isItaliano === true && isInternational === true) {
        messages.push(`member with *italiano* and *international* role: *${member.displayName}, ${member.nickname}, ${member.user.username}*\n`);
      }
      if (isItaliano === true && isEnglish === true) {
        messages.push(`member with *italiano* and *english* role: *${member.displayName}, ${member.nickname}, ${member.user.username}*\n`);
      }
      if (isEnglish === true && isInternational === true) {
        messages.push(`member with *english* and *international* role: *${member.displayName}, ${member.nickname}, ${member.user.username}*\n`);
      }
    }
  });

  if (messages.length > 0) {
    const channel = interaction.guild.channels.cache.find((channel) => channel.name === customChannels.internal)
      ?? interaction.guild.publicUpdatesChannel;
    sendMesseges(messages, channel);
    await interaction.followUp("done");
  } else {
    await interaction.editReply("no problems found");
  }
};

export { checkMembers };

