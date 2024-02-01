import { EmbedBuilder } from "discord.js";
import { globalPoints } from "../events/ready.js";
import { customPoints } from "../resources/custom-points.js";
import { getCustomRole } from "../resources/custom-roles.js";

/**
 * @param {import("discord.js").Interaction} interaction 
 */
const chartPromotionPoints = async (interaction) => {
  await interaction.deferReply();
  const chart = [];

  for (const id in globalPoints[interaction.guild.id]) {
    const member = interaction.guild.members.cache.get(id);

    if (member === undefined) {
      return console.error(member);
    }

    const level = Math.floor(globalPoints[member.guild.id][member.id] / customPoints.promotionPoints) + 1;

    if (interaction.guild.ownerId !== id) {
      chart.push({
        level,
        member,
        role: getCustomRole(member) || "n.a.",
        points: globalPoints[interaction.guild.id][id] % customPoints.promotionPoints
      });
    }
  }

  chart.sort((a, b) => b.points - a.points);
  const sortedChart = chart.slice(0, 10);
  let chartRow = "";
  sortedChart.forEach((element, index) => {
    chartRow += `${index + 1}: ${element.role} *${element.member}* ${element.points} (lvl. ${element.level}) ⭐\n`;
  });
  const message = new EmbedBuilder();
  message.setTitle("🏆🔰 promotion points chart");
  message.setDescription(`registered activity to next promotion. automatic rank-up every ${customPoints.promotionPoints} points\n\n${chartRow}`);
  message.addFields({ name: "\u200b", value: "*use __/view-promotions-point__ to see yours*" });
  message.setFooter({ text: `${interaction.member.displayName}`, iconURL: `${interaction.member.displayAvatarURL()}` });
  message.setTimestamp();
  message.setColor("DarkGreen");
  await interaction.editReply({ embeds: [message] });
};

export { chartPromotionPoints };

