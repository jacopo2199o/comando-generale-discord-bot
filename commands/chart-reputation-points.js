import { EmbedBuilder } from "discord.js";
import { reputationPoints } from "../events/ready.js";
import { getCustomRole } from "../resources/general-utilities.js";

/**
 * @param {import("discord.js")} interaction 
 */
const chartReputationPoints = async (interaction) => {
  const chart = [];
  const embedMessage = new EmbedBuilder();

  let chartRow = "";
  let sortedChart = [];

  await interaction.deferReply();

  for (const id in reputationPoints[interaction.guild.id]) {
    const guildMember = interaction.guild.members.cache.get(id);

    if (interaction.guild.ownerId !== id) {
      chart.push({
        guildMember,
        role: getCustomRole(guildMember),
        points: reputationPoints[interaction.guild.id][id].points
      });
    }
  }

  sortedChart = [...chart]
    .sort((a, b) => b.points - a.points)
    .slice(0, 10);

  sortedChart.forEach((element, index) => {
    chartRow += `${index + 1}: ${element.role} *${element.guildMember}* ${element.points} 🏵\n`;
  });

  embedMessage
    .setTitle("🏆🏵 reputation points chart")
    .setDescription(`based on voluntary reputation exchange between members\n\n${chartRow}`)
    .addFields({ name: "\u200b", value: "*use __/give-reputation-point__ to boost your favourite member*", inline: false })
    .setFooter({ text: `${interaction.member.displayName}`, iconURL: `${interaction.member.displayAvatarURL()}` })
    .setTimestamp()
    .setColor("DarkGreen");

  await interaction.editReply({ embeds: [embedMessage] });
};

export { chartReputationPoints };

