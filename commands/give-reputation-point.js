import { EmbedBuilder } from "discord.js";
import { reputationPoints } from "../events/ready.js";
import { customChannels } from "../resources/custom-channels.js";
import { customRoles } from "../resources/custom-roles.js";

/**
 * @param {import("discord.js").Interaction} interaction
 */
const giveReputationPoint = async (interaction) => {
  const customChannel = interaction.guild.channels.cache.find((channel) => channel.name === customChannels.internal);
  const member = interaction.options.getUser("member");
  const guildMemberTaker = interaction.guild.members.cache.find((guildMember) => guildMember.id === member.id);
  const guildMemberMaker = interaction.guild.members.cache.find((guildMember) => guildMember.id === interaction.member.id);

  let embedMessage1 = new EmbedBuilder();
  let embedMessage2 = new EmbedBuilder();
  let guildMemberMakerCustomRole = undefined;
  let guildMemberTakerCustomRole = undefined;
  let oldGuildMemberTakerCustomRole = undefined;

  guildMemberMaker.roles.cache.forEach((role) => {
    const rankIndex = customRoles.findIndex((customRole) => customRole === role.name);

    if (rankIndex !== -1) {
      guildMemberMakerCustomRole = role;
    }
  });

  guildMemberTaker.roles.cache.forEach((role) => {
    const rankIndex = customRoles.findIndex((customRole) => customRole === role.name);

    if (rankIndex !== -1) {
      guildMemberTakerCustomRole = role;
    }
  });

  await interaction.deferReply();

  if (guildMemberTaker.id === interaction.member.id) {
    await interaction.editReply("you can not select yourself\n");
  } else {
    if (reputationPoints[interaction.member.id].gaveTo === undefined) {
      reputationPoints[interaction.member.id].gaveTo = guildMemberTaker.id;
      reputationPoints[guildMemberTaker.id].points += 1;

      interaction.client.emit("activity", guildMemberTaker, 100);

      embedMessage1
        .setTitle("🏵 reputation points")
        .setDescription(`${guildMemberMakerCustomRole} *${interaction.member}* give 1 *reputation point* to ${guildMemberTakerCustomRole} *${guildMemberTaker}*\n`)
        .setThumbnail(guildMemberMaker.displayAvatarURL({ dynamic: true }))
        .setTimestamp()
        .setColor(guildMemberMakerCustomRole.color);

      await interaction.editReply({ embeds: [embedMessage1] });
    } else {
      const oldGuildMemberTaker = interaction.guild.members.cache.find((member) => member.id === reputationPoints[interaction.member.id].gaveTo);

      oldGuildMemberTaker.roles.cache.forEach((role) => {
        const rankIndex = customRoles.findIndex((customRole) => customRole === role.name);

        if (rankIndex !== -1) {
          oldGuildMemberTakerCustomRole = role;
        }
      });

      reputationPoints[interaction.member.id].gaveTo = guildMemberTaker.id;
      reputationPoints[oldGuildMemberTaker.id].points -= 1;
      reputationPoints[guildMemberTaker.id].points += 1;

      interaction.client.emit("activity", guildMemberTaker, 100);
      interaction.client.emit("activity", oldGuildMemberTaker, -100);

      embedMessage1
        .setTitle("🏵 reputation points")
        .setDescription(`${guildMemberMakerCustomRole} *${interaction.member}* give 1 *reputation point* to ${guildMemberTakerCustomRole} *${guildMemberTaker}*\n`)
        .setThumbnail(guildMemberMaker.displayAvatarURL({ dynamic: true }))
        .setTimestamp()
        .setColor(guildMemberMakerCustomRole.color);
      embedMessage2
        .setTitle("🏵 reputation points")
        .setDescription(`${oldGuildMemberTakerCustomRole} *${oldGuildMemberTaker}* lost 1 *reputation point*\n`)
        .setThumbnail(oldGuildMemberTaker.displayAvatarURL({ dynamic: true }))
        .setTimestamp()
        .setColor(oldGuildMemberTakerCustomRole.color);

      customChannel.send({ embeds: [embedMessage2] });

      await interaction.editReply({ embeds: [embedMessage1, embedMessage2] });
    }
  }

  embedMessage1
    .setTitle("🏵 reputation points")
    .setDescription(`${guildMemberTakerCustomRole} *${guildMemberTaker}* received 1 *reputation point*\n`)
    .setThumbnail(guildMemberTaker.displayAvatarURL({ dynamic: true }))
    .setTimestamp()
    .setColor(guildMemberMakerCustomRole.color);

  customChannel.send({ embeds: [embedMessage1] });
};

export { giveReputationPoint };