import { reputationPoints } from "../events/ready.js";
import { customChannels } from "../resources/custom-channels.js";
import { customRoles } from "../resources/custom-roles.js";
import { sendMesseges } from "../resources/general-utilities.js";

/**
 * @param {import("discord.js").Interaction} interaction
 */
const giveReputationPoint = async (interaction) => {
  const channel = interaction.guild.channels.cache.find((channel) => channel.name === customChannels.public);
  const user = interaction.options.getUser("member");
  const guildMemberAuthor = interaction.guild.members.cache.find((guildMember) => guildMember.id === interaction.member.id);
  const guildMember = interaction.guild.members.cache.find((guildMember) => guildMember.id === user.id);

  let guildMemberAuthorCustomRole = undefined;
  let guildMemberCustomRole = undefined;
  let oldGuildMemberCustomRole = undefined;
  let messages = [];

  guildMemberAuthor.roles.cache.forEach((role) => {
    const rankIndex = customRoles.findIndex((customRole) => customRole === role.name);

    if (rankIndex !== -1) {
      guildMemberAuthorCustomRole = customRoles[rankIndex];
    }
  });

  guildMember.roles.cache.forEach((role) => {
    const rankIndex = customRoles.findIndex((customRole) => customRole === role.name);

    if (rankIndex !== -1) {
      guildMemberCustomRole = customRoles[rankIndex];
    }
  });

  await interaction.deferReply();

  if (guildMember.id === interaction.member.id) {
    await interaction.editReply("you can not select yourself\n");
  } else {
    if (reputationPoints[interaction.member.id].gaveTo === undefined) {
      reputationPoints[interaction.member.id].gaveTo = guildMember.id;
      reputationPoints[guildMember.id].points += 1;

      messages.push(`🏵 ${guildMemberAuthorCustomRole} *${interaction.member.displayName}* give 1 reputation point to ${guildMemberCustomRole} *${guildMember.displayName}*\n`);
      sendMesseges(messages, channel);
      messages = [];
    } else {
      const oldGuildMember = interaction.guild.members.cache.find((member) => member.id === reputationPoints[interaction.member.id].gaveTo);

      oldGuildMember.roles.cache.forEach((role) => {
        const rankIndex = customRoles.findIndex((customRole) => customRole === role.name);
    
        if (rankIndex !== -1) {
          oldGuildMemberCustomRole = customRoles[rankIndex];
        }
      });  

      reputationPoints[interaction.member.id].gaveTo = guildMember.id;
      reputationPoints[oldGuildMember.id].points -= 1;
      reputationPoints[guildMember.id].points += 1;
      
      interaction.client.emit("activity", guildMember, channel, 100);
      interaction.client.emit("activity", oldGuildMember, channel, -100);

      messages.push(`🏵 ${guildMemberAuthorCustomRole} *${interaction.member.displayName}* give 1 reputation point to ${guildMemberCustomRole} *${guildMember.displayName}*\n`);
      messages.push(`🏵 ${oldGuildMemberCustomRole} *${oldGuildMember.displayName}* lost 1 reputation point\n`);
      sendMesseges(messages, channel);
      messages = [];
    }

    
    await interaction.editReply(`${guildMemberCustomRole} *${guildMember.displayName}* received 🏵 1 reputation point\n`);
  }
};

export { giveReputationPoint };