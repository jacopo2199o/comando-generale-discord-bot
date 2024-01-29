import { EmbedBuilder } from "discord.js";
import { globalPoints } from "../events/ready.js";
import { customPoints } from "../resources/custom-points.js";
import { getCustomRole } from "../resources/custom-roles.js";

/**
 * @param {import("discord.js").Interaction} interaction 
 */
const chartPromotionPoints = async (interaction) => {
  const chart = [];
  const message = new EmbedBuilder();

  let chartRow = "";
  let sortedChart = [];

  await interaction.deferReply();

  for (const id in globalPoints[interaction.guild.id]) {
    const member = interaction.guild.members.cache.get(id);
    const level = Math.floor(globalPoints[member.guild.id][member.id] / customPoints.promotionPoints) + 1;

    if (interaction.guild.ownerId !== id) {
      chart.push({
        level,
        member,
        role: getCustomRole(member),
        points: globalPoints[interaction.guild.id][id] % customPoints.promotionPoints
      });
    }
  }

  sortedChart = [...chart]
    .sort((a, b) => b.points - a.points)
    .slice(0, 10);

  sortedChart.forEach(
    (element, index) => {
      chartRow += `${index + 1}: ${element.role} *${element.member}* ${element.points} (lvl. ${element.level}) ⭐\n`;
    }
  );

  message
    .setTitle("🏆🔰 promotion points chart")
    .setDescription(`registered activity to next promotion. automatic rank-up every ${customPoints.promotionPoints} points\n\n${chartRow}`)
    .addFields({
      name: "\u200b",
      value: "*use __/view-promotions-point__ to see yours*"
    })
    .setFooter({
      text: `${interaction.member.displayName}`,
      iconURL: `${interaction.member.displayAvatarURL()}`
    })
    .setTimestamp()
    .setColor("DarkGreen");

  await interaction.editReply({ embeds: [message] });
};

export { chartPromotionPoints };

