import { EmbedBuilder } from "discord.js";
import { globalPoints } from "../events/ready.js";
import { customPoints } from "../resources/custom-points.js";
import { getCustomRole } from "../resources/custom-roles.js";

/**
 * @param {import("discord.js").Interaction} interaction
 */
const chartGlobalPoints = async (interaction) => {
  const chart = [];
  const message = new EmbedBuilder();

  let chartRow = "";
  let sortedChart = [];

  await interaction.deferReply();

  for (const memberId in globalPoints[interaction.guild.id]) {
    const member = interaction.guild.members.cache.get(memberId);
    const level = Math.floor(globalPoints[member.guild.id][member.id] / customPoints.promotionPoints) + 1;

    if (interaction.guild.ownerId !== memberId) {
      chart.push({
        level,
        member,
        role: getCustomRole(member),
        points: globalPoints[interaction.guild.id][memberId]
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
    .setTitle("🏆⭐ global points chart")
    .setDescription(`registered activity since a user become a member\n\n${chartRow}`)
    .setFooter({
      text: `${interaction.member.displayName}`,
      iconURL: `${interaction.member.displayAvatarURL()}`
    })
    .setTimestamp()
    .setColor("DarkGreen");

  await interaction.editReply({ embeds: [message] });
};

export { chartGlobalPoints };

