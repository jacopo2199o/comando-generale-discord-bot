import { customRoles } from "../resources/custom-roles.js";
import { sendMesseges } from "../resources/general-utilities.js";
/**
 * @param {import("discord.js").Interaction} interaction
 */
const interactionCreate = async (interaction) => {
  let messages = [];

  if (!interaction.isChatInputCommand()) {
    return;
  }

  if (interaction.commandName === "check-activity") {
    const members = await interaction.client.guilds.resolve(interaction.guild.id)
      .members.fetch();

    let isDowngrading = false;

    await interaction.deferReply();

    members.forEach((member) => {
      if (member.id !== interaction.guild.ownerId) {
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
      }
    });

    if (isDowngrading) {
      await interaction.editReply("starting monthly downgrade...");
    } else {
      await interaction.editReply("nobody to downgrade");
    }
  } else if (interaction.commandName === "check-landing") {
    const members = await interaction.client.guilds.resolve(interaction.guild.id)
      .members.fetch();

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
      sendMesseges(messages, interaction.channel);
      messages = [];
      await interaction.editReply("done");
    }
  } else if (interaction.commandName === "about") {
    await interaction.deferReply();

    if (interaction.channel.isThread()) {
      await interaction.editReply(interaction.channel.parent.topic);
    } else if (interaction.channel.isVoiceBased()){
      await interaction.editReply("description is not available for voice channels");
    } else {
      await interaction.editReply(interaction.channel.topic);
    }
  } else {
    console.error(`no command matching ${interaction.commandName} was found`);
    return interaction.reply({ content: `comando inesistente /${interaction.commandName}`, ephemeral: true });
  }
};

export { interactionCreate };