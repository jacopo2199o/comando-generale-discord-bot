import { sendMesseges } from "../resources/general-utilities.js";

/**
 * @param {import("discord.js").Interaction} interaction
 */
const checkLanding = async (interaction) => {
  const members = await interaction.client.guilds.resolve(interaction.guild.id)
    .members.fetch();

  let messages = [];

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
    await interaction.reply("all members registered");
  } else {
    sendMesseges(messages, interaction.channel);
    messages = [];
    await interaction.reply("done");
  }
};

export { checkLanding };