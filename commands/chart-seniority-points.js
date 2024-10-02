import {
  EmbedBuilder
} from "discord.js";
import {
  seniority
} from "../events/ready.js";
import {
  getCustomRole
} from "../resources/custom-roles.js";

/**
 * @param {import("discord.js").Interaction} interaction
 */
async function chartSeniorityPoints(
  interaction
) {
  await interaction.deferReply();
  const members = await interaction.guild.members.fetch();
  members.forEach(
    function (
      member
    ) {
      seniority[interaction.guild.id][member.id] = Math.round(
        (new Date().getTime() - member.joinedAt.getTime()) / (1000 * 60 * 60 * 24)
      );
    }
  );
  const chart = [];
  for (
    const memberId in seniority[interaction.guild.id]
  ) {
    const member = interaction.guild.members.cache.get(
      memberId
    );
    if (
      member === undefined
    ) {
      return console.error("chart seniority points: member undefined");
    }
    if (
      member.id !== interaction.guild.ownerId
    ) {
      chart.push(
        {
          member,
          role: getCustomRole(
            member
          ) ?? "n.a.",
          points: seniority[interaction.guild.id][member.id]
        }
      );
    }
  }
  chart.sort(
    function (
      a,
      b
    ) {
      return b.points - a.points;
    }
  );
  const sortedChart = chart.slice(
    0,
    10
  );
  let chartRow = "";
  sortedChart.forEach(
    function (
      element,
      index
    ) {
      chartRow += `${index + 1}: ${element.role} *${element.member}* ${element.points} 🌳\n`;
    }
  );
  const message = new EmbedBuilder();
  message.setTitle(
    "🏆🌳 seniority chart"
  );
  message.setDescription(
    `each point is equivalent to one day of stay\n\n${chartRow}`
  );
  //message.addFields({ name: "\u200b", value: "*use __/view-seniority-point__ to see yours*" });
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

export {
  chartSeniorityPoints
};

