import { EmbedBuilder } from "discord.js";
import { globalPoints } from "../events/ready.js";
import { getCustomRole } from "../resources/general-utilities.js";

/**
 * @param {import("discord.js").Interaction} interaction 
 */
const chartPromotionPoints = async (interaction) => {
  const chart = [];

  let chartTextRow = "";
  let embedMessage = new EmbedBuilder();
  let sortedChart = [];

  await interaction.deferReply();

  for (const id in globalPoints[interaction.guild.id]) {
    const guildMember = interaction.guild.members.cache.get(id);

    chart.push({
      guildMember,
      role: getCustomRole(guildMember),
      points: globalPoints[interaction.guild.id][id].pp
    });
  }

  sortedChart = [...chart]
    .sort((a, b) => b.points - a.points)
    .slice(0, 10);

  sortedChart.forEach((element, index) => {
    chartTextRow += `${index + 1}: ${element.role} *${element.guildMember}* ${element.points} ⭐\n`;
  });

  embedMessage
    .setTitle("🏆 promotion points chart")
    .setDescription(`based on real server activities like: messages, reactions, threads, invites and many others\n\n${chartTextRow}`)
    .setFooter({ text: `${interaction.member.displayName}`, iconURL: `${interaction.member.displayAvatarURL()}` })
    .setTimestamp()
    .setColor("DarkGreen");

  await interaction.editReply({ embeds: [embedMessage] });
};

export { chartPromotionPoints };