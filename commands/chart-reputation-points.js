import {
  EmbedBuilder
} from "discord.js";
import {
  globalPoints,
  reputationPoints
} from "../events/ready.js";
import {
  customPoints
} from "../resources/custom-points.js";
import {
  getCustomRole
} from "../resources/custom-roles.js";

/**
 * @param {import("discord.js").Interaction} interaction 
 */
async function chartReputationPoints(
  interaction
) {
  await interaction.deferReply();
  const chart = [];
  for (
    const memberId in reputationPoints[interaction.guild.id]
  ) {
    const member = interaction.guild.members.cache.get(
      memberId
    );
    if (
      member === undefined
    ) {
      return console.error("chart reputation points: member undefined");
    }
    if (
      interaction.guild.ownerId !== memberId
    ) {
      chart.push(
        {
          level: Math.floor(
            globalPoints[member.guild.id][member.id] / customPoints.promotionPoints
          ) + 1,
          member,
          role: getCustomRole(
            member
          ) ?? "n.a.",
          points: reputationPoints[interaction.guild.id][memberId].points
        }
      );
    }
  }

  chart.sort(
    (
      a,
      b
    ) => {
      return b.points - a.points;
    }
  );
  const sortedChart = chart.slice(
    0,
    10
  );
  let chartRow = "";
  sortedChart.forEach(
    (
      element,
      index
    ) => {
      chartRow += `${index + 1}: ${element.role} *${element.member}* ${element.points} (lvl. ${element.level}) 🏵\n`;
    }
  );
  const message = new EmbedBuilder();
  message.setTitle(
    "🏆🏵 reputation points chart"
  );
  message.setDescription(
    `based on voluntary reputation exchange between members\n\n${chartRow}`
  );
  message.addFields(
    {
      name: "\u200b",
      value: "*use __/give-reputation-point__ to boost your favourite member*"
    }
  );
  message.setFooter(
    {
      text: `${interaction.member.displayName}`,
      iconURL: `${interaction.member.displayAvatarURL()}`
    }
  );
  message.setTimestamp();
  message.setColor(
    "DarkGreen"
  );
  await interaction.editReply(
    {
      embeds: [
        message
      ]
    }
  );
}

export {chartReputationPoints};

