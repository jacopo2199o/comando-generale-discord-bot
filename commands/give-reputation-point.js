import { EmbedBuilder } from "discord.js";
import { reputationPoints } from "../events/ready.js";
import { customChannels } from "../resources/custom-channels.js";
import { customPoints } from "../resources/custom-points.js";
import { getCustomRole } from "../resources/general-utilities.js";

/**
 * @param {import("discord.js").Interaction} interaction
 */
const giveReputationPoint = async (interaction) => {
  const customChannel = interaction.guild.channels.cache.find((channel) => channel.name === customChannels.activity);
  const guildMembers = await interaction.guild.members.fetch();
  /**
   * @type { import("discord.js").User }
   */
  const guildMemberTaker = guildMembers.get(
    interaction.options.getUser("member").id
  );
  const guildMemberMaker = guildMembers.get(interaction.member.id);
  const guildMemberMakerCustomRole = getCustomRole(
    guildMembers.get(interaction.member.id)
  );
  const guildMemberTakerCustomRole = getCustomRole(
    guildMembers.get(
      interaction.options.getUser("member").id
    )
  );
  const embedMessage1 = new EmbedBuilder();
  const embedMessage3 = new EmbedBuilder();
  const embedMessage2 = new EmbedBuilder();
  const userOption = interaction.options.getUser("member");

  await interaction.deferReply();

  if (guildMemberTaker.id === interaction.member.id) {
    await interaction.editReply("you can not select yourself");
  } else if (userOption.bot) {
    await interaction.editReply("you can not select a bot");
  } else {
    if (reputationPoints[interaction.guild.id][interaction.member.id].gaveTo === "") {
      reputationPoints[interaction.guild.id][interaction.member.id].gaveTo = guildMemberTaker.id;
      reputationPoints[interaction.guild.id][guildMemberTaker.id].points += 1;

      interaction.client.emit("activity", guildMemberTaker, customPoints.reputationPoints.maker);
      interaction.client.emit("activity", guildMemberTaker, customPoints.reputationPoints.taker);

      embedMessage1
        .setTitle("🏵 reputation points")
        .setDescription(`${guildMemberMakerCustomRole} *${interaction.member}* give 1 *reputation point* to ${guildMemberTakerCustomRole} *${guildMemberTaker}*`)
        .addFields({ name: "promotion points", value: `${customPoints.reputationPoints.taker} ⭐`, inline: true })
        .addFields({ name: "to", value: `${guildMemberTaker}`, inline: true })
        .setThumbnail(guildMemberTaker.displayAvatarURL({ dynamic: true }))
        .setFooter({ text: `${customPoints.reputationPoints.maker} ⭐ to ${guildMemberMaker.displayName}`, iconURL: `${guildMemberMaker.displayAvatarURL()}` })
        .setTimestamp()
        .setColor(guildMemberMakerCustomRole.color);

      await interaction.editReply({ embeds: [embedMessage1] });
    } else {
      const oldGuildMemberTaker = guildMembers.get(reputationPoints[interaction.guild.id][interaction.member.id].gaveTo);
      const oldGuildMemberTakerCustomRole = getCustomRole(
        guildMembers.get(reputationPoints[interaction.guild.id][interaction.member.id].gaveTo)
      );

      reputationPoints[interaction.guild.id][interaction.member.id].gaveTo = guildMemberTaker.id;
      reputationPoints[interaction.guild.id][oldGuildMemberTaker.id].points -= 1;
      reputationPoints[interaction.guild.id][guildMemberTaker.id].points += 1;

      interaction.client.emit("activity", guildMemberTaker, customPoints.reputationPoints.maker);
      interaction.client.emit("activity", guildMemberTaker, customPoints.reputationPoints.taker);
      interaction.client.emit("activity", oldGuildMemberTaker, customPoints.reputationPoints.oldTaker);

      embedMessage1
        .setTitle("🏵 reputation points")
        .setDescription(`${guildMemberMakerCustomRole} *${interaction.member}* gives 1 *reputation point* to ${guildMemberTakerCustomRole} *${guildMemberTaker}*`)
        .addFields({ name: "promotion points", value: `${customPoints.reputationPoints.taker} ⭐`, inline: true })
        .addFields({ name: "to", value: `${guildMemberTaker}`, inline: true })
        .setThumbnail(guildMemberTaker.displayAvatarURL({ dynamic: true }))
        .setFooter({ text: `${customPoints.reputationPoints.maker} ⭐ to ${guildMemberMaker.displayName}`, iconURL: `${guildMemberMaker.displayAvatarURL()}` })
        .setTimestamp()
        .setColor(guildMemberMakerCustomRole.color);
      embedMessage2
        .setTitle("🏵 reputation points")
        .setDescription(`${oldGuildMemberTakerCustomRole} *${oldGuildMemberTaker}* lost 1 *reputation point*`)
        .addFields({ name: "promotion points", value: `${customPoints.reputationPoints.oldTaker} ⭐`, inline: true })
        .addFields({ name: "to", value: `${oldGuildMemberTaker}`, inline: true })
        .setThumbnail(oldGuildMemberTaker.displayAvatarURL({ dynamic: true }))
        .setTimestamp()
        .setColor(oldGuildMemberTakerCustomRole.color);

      await interaction.editReply({ embeds: [embedMessage1, embedMessage2] });
    }

    if (interaction.channelId !== customChannel.id) {
      embedMessage3
        .setTitle("🏵 reputation points")
        .setDescription(`${guildMemberMakerCustomRole} *${interaction.member}* give 1 *reputation point* to ${guildMemberTakerCustomRole} *${guildMemberTaker}*`)
        .addFields({ name: "promotion points", value: `${customPoints.reputationPoints.taker} ⭐`, inline: true })
        .addFields({ name: "to", value: `${guildMemberTaker}`, inline: true })
        .setThumbnail(guildMemberTaker.displayAvatarURL({ dynamic: true }))
        .setFooter({ text: `${customPoints.reputationPoints.maker} ⭐ to ${guildMemberMaker.displayName}`, iconURL: `${guildMemberMaker.displayAvatarURL()}` })
        .setTimestamp()
        .setColor(guildMemberMakerCustomRole.color);

      customChannel.send({ embeds: [embedMessage3] });
    }
  }
};

export { giveReputationPoint };

