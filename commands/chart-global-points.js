import { EmbedBuilder } from "discord.js";
import { globalPoints, pointsLastMove } from "../events/ready.js";
import { customPoints } from "../resources/custom-points.js";
import { getCustomRole } from "../resources/custom-roles.js";

/**
 * @param {import("discord.js").Interaction} interaction
 */
const chartGlobalPoints = async (interaction) => {
  await interaction.deferReply();
  const chart = [];

  for (const memberId in globalPoints[interaction.guild.id]) {
    const member = interaction.guild.members.cache.get(memberId);

    if (member === undefined) {
      return console.error(member);
    }

    if (interaction.guild.ownerId !== member.id) {
      chart.push({
        lastMove: pointsLastMove[interaction.guild.id][member.id],
        level: Math.floor(globalPoints[member.guild.id][memberId] / customPoints.promotionPoints) + 1,
        member,
        role: getCustomRole(member) ?? "n.a.",
        points: globalPoints[interaction.guild.id][member.id]
      });
    }
  }

  chart.sort((a, b) => b.points - a.points);
  const sortedChart = chart.slice(0, 10);
  let chartRow = "";
  sortedChart.forEach((element, index) => {
    const lastMove = element.lastMove > 0 ? "🔼" : "🔻";
    chartRow += `${index + 1}: ${element.role} *${element.member}* ${element.points} ${lastMove} (lvl. ${element.level}) ⭐\n`;
  });
  const message = new EmbedBuilder();
  message.setTitle("🏆⭐ global points chart");
  message.setDescription(`registered activity since a user become a member\n\n${chartRow}`);
  message.addFields({ name: "\u200b", value: "*use __/view-promotions-point__ to see yours*" });
  message.setFooter({ text: `${interaction.member.displayName}`, iconURL: `${interaction.member.displayAvatarURL()}` });
  message.setTimestamp();
  message.setColor("DarkGreen");
  await interaction.editReply({ embeds: [message] });
};

export { chartGlobalPoints };

