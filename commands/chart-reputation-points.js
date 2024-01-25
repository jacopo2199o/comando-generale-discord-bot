import { EmbedBuilder } from "discord.js";
import { globalPoints, reputationPoints } from "../events/ready.js";
import { customPoints } from "../resources/custom-points.js";
import { getCustomRole } from "../resources/general-utilities.js";

/**
 * @param {import("discord.js")} interaction 
 */
const chartReputationPoints = async (interaction) => {
  const chart = [];
  const message = new EmbedBuilder();

  let chartRow = "";
  let sortedChart = [];

  await interaction.deferReply();

  for (const id in reputationPoints[interaction.guild.id]) {
    const member = interaction.guild.members.cache.get(id);
    const level = Math.floor(globalPoints[member.guild.id][member.id] / customPoints.promotionPoints) + 1;

    if (interaction.guild.ownerId !== id) {
      chart.push({
        level,
        member,
        role: getCustomRole(member),
        points: reputationPoints[interaction.guild.id][id].points
      });
    }
  }

  sortedChart = [...chart]
    .sort((a, b) => b.points - a.points)
    .slice(0, 10);

  sortedChart.forEach(
    (element, index) => {
      chartRow += `${index + 1}: ${element.role} *${element.member}* ${element.points} (lvl. ${element.level}) 🏵\n`;
    }
  );

  message
    .setTitle("🏆🏵 reputation points chart")
    .setDescription(`based on voluntary reputation exchange between members\n\n${chartRow}`)
    .addFields({
      name: "\u200b",
      value: "*use __/give-reputation-point__ to boost your favourite member*"
    })
    .setFooter({ text: `${interaction.member.displayName}`, iconURL: `${interaction.member.displayAvatarURL()}` })
    .setTimestamp()
    .setColor("DarkGreen");

  await interaction.editReply({ embeds: [message] });
};

export { chartReputationPoints };

