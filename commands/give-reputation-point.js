import { EmbedBuilder } from "discord.js";
import { reputationPoints } from "../events/ready.js";
import { customChannels } from "../resources/custom-channels.js";
import { customPoints, getCalculatedPoints } from "../resources/custom-points.js";
import { getCustomRole } from "../resources/custom-roles.js";

/**
 * @param {import("discord.js").Interaction} interaction
 */
const giveReputationPoint = async (interaction) => {
  await interaction.deferReply();
  const channel = interaction.guild.channels.cache.find((channel) => channel.name === customChannels.public)
    || interaction.guild.channels.cache.get(interaction.guild.publicUpdatesChannelId);
  /**
   * @type { import("discord.js").User }
   */
  const user = interaction.options.getUser("member");

  if (user === null) {
    return console.error(user);
  }

  const maker = interaction.guild.members.cache.get(interaction.member.id);
  const taker = interaction.guild.members.cache.get(user.id);

  if (maker === undefined || taker === undefined) {
    return console.error(maker, taker);
  }

  const makerPoints = getCalculatedPoints(customPoints.reputationPoints.maker, reputationPoints[interaction.guild.id][maker.id].points);
  const takerPoints = getCalculatedPoints(customPoints.reputationPoints.taker, reputationPoints[interaction.guild.id][taker.id].points);
  const makerRole = getCustomRole(maker);
  const takerRole = getCustomRole(taker);

  if (makerRole === undefined || takerRole === undefined) {
    return console.error(makerRole, takerRole);
  }

  if (taker.id === interaction.member.id) {
    await interaction.editReply("you can not select yourself");
  } else if (taker.id === interaction.guild.ownerId) {
    await interaction.editReply("you can not select the server owner");
  } else if (user.bot) {
    await interaction.editReply("you can not select a bot");
  } else if (reputationPoints[interaction.guild.id][maker.id].gaveTo == taker.id) {
    await interaction.editReply(`you already give a reputation points to ${taker}`);
  } else {
    if (reputationPoints[interaction.guild.id][maker.id].gaveTo === "") {
      reputationPoints[interaction.guild.id][maker.id].gaveTo = taker.id;
      reputationPoints[interaction.guild.id][taker.id].points += 1;
      interaction.client.emit("activity", maker, makerPoints);
      interaction.client.emit("activity", taker, takerPoints);
      const message = new EmbedBuilder();
      message.setTitle("🏵 reputation points");
      message.setDescription(`${makerRole} *${interaction.member}* gave 1 *reputation point* to ${takerRole} *${taker}*`);
      message.addFields({ name: "promotion points", value: `${takerPoints} ⭐`, inline: true });
      message.addFields({ name: "to", value: `${taker}`, inline: true });
      message.setThumbnail(taker.displayAvatarURL({ dynamic: true }));
      message.setFooter({ text: `${makerPoints} ⭐ to ${maker.displayName}`, iconURL: `${maker.displayAvatarURL()}` });
      message.setTimestamp();
      message.setColor(makerRole.color);
      await interaction.editReply({ embeds: [message] });
    } else {
      const previousTaker = interaction.guild.members.cache.get(reputationPoints[interaction.guild.id][maker.id].gaveTo);

      if (previousTaker === undefined) {
        return console.error(previousTaker);
      }

      const previousTakerPoints = getCalculatedPoints(customPoints.reputationPoints.taker, reputationPoints[interaction.guild.id][previousTaker.id].points);
      const previousTakerRole = getCustomRole(previousTaker);

      if (previousTakerRole === undefined) {
        return console.error(previousTakerRole);
      }

      reputationPoints[interaction.guild.id][maker.id].gaveTo = taker.id;
      reputationPoints[interaction.guild.id][taker.id].points += 1;
      reputationPoints[interaction.guild.id][previousTaker.id].points -= 1;
      interaction.client.emit("activity", maker, makerPoints);
      interaction.client.emit("activity", taker, takerPoints);
      interaction.client.emit("activity", previousTaker, -previousTakerPoints);
      const message = new EmbedBuilder();
      message.setTitle("🏵 reputation points");
      message.setDescription(`${makerRole} *${interaction.member}* gave 1 *reputation point* to ${takerRole} *${taker}*`);
      message.addFields({ name: "promotion points", value: `${takerPoints} ⭐`, inline: true });
      message.addFields({ name: "to", value: `${taker}`, inline: true });
      message.setThumbnail(taker.displayAvatarURL({ dynamic: true }));
      message.setFooter({ text: `${makerPoints} ⭐ to ${maker.displayName}`, iconURL: `${maker.displayAvatarURL()}` });
      message.setTimestamp();
      message.setColor(makerRole.color);
      const message2 = new EmbedBuilder();
      message2.setTitle("🏵 reputation points");
      message2.setDescription(`${previousTakerRole} *${previousTaker}* lost 1 *reputation point*`);
      message2.addFields({ name: "promotion points", value: `${-previousTakerPoints} ⭐`, inline: true });
      message2.addFields({ name: "to", value: `${previousTaker}`, inline: true });
      message2.setThumbnail(previousTaker.displayAvatarURL({ dynamic: true }));
      message2.setTimestamp();
      message2.setColor(previousTakerRole.color);
      await interaction.editReply({ embeds: [message, message2] });
    }

    if (interaction.channel.id !== channel.id) {
      const message = new EmbedBuilder();
      message.setTitle("🏵 reputation points 🏵");
      message.setDescription(`${makerRole} *${interaction.member}* gave 1 *reputation point* to ${takerRole} *${taker}*`);
      message.addFields({ name: "promotion points", value: `${customPoints.reputationPoints.taker} ⭐`, inline: true });
      message.addFields({ name: "to", value: `${taker}`, inline: true });
      message.setThumbnail(taker.displayAvatarURL({ dynamic: true }));
      message.setFooter({ text: `${customPoints.reputationPoints.maker} ⭐ to ${maker.displayName}`, iconURL: `${maker.displayAvatarURL()}` });
      message.setTimestamp();
      message.setColor(makerRole.color);
      channel.send({ embeds: [message] });
    }
  }
};

export { giveReputationPoint };

