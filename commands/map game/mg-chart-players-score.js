import {
  EmbedBuilder
} from "discord.js";
import http from "node:http";
/**
 * @param {import("discord.js").Interaction} interaction
 */
async function chartPlayersScore(
  interaction
) {
  await interaction.deferReply();
  const request = http.request(
    {
      host: "localhost",
      port: "3000",
      path: "/map/players?id=0",
      method: "GET",
    },
    function (
      response
    ) {
      let data = "";
      response.on(
        "data",
        function (
          chunk
        ) {
          data += chunk;
        }
      ).on(
        "end",
        async function () {
          if (
            response.statusCode == 200
          ) {
            const playersStatistics = JSON.parse(
              data
            ).sort(
              function (
                a,
                b
              ) {
                return b.score - a.score;
              }
            );
            const sortedChart = playersStatistics.slice(
              0,
              10
            );
            let row = "";
            sortedChart.forEach(
              function (
                element,
                index
              ) {
                row += `${index + 1}: *${element.nickname}* with ${element.score} score ⭐\n`;
              }
            );
            if (
              playersStatistics.length == 0
            ) {
              return;
            }
            const message = new EmbedBuilder().setTitle(
              "🗺️🏆 map game - score chart"
            ).setDescription(
              `top 10 best players by score of *map game, italy*\n\n${row}`
            ).addFields(
              {
                name: "\u200b",
                value: "*use __/mg-view-profile__ to see yours*"
              }
            ).setFooter(
              {
                text: `${interaction.member.displayName}`,
                iconURL: `${interaction.member.displayAvatarURL()}`
              }
            ).setTimestamp().setColor(
              "DarkGreen"
            );
            await interaction.editReply(
              {
                embeds: [
                  message
                ]
              }
            );
          } else {
            await interaction.editReply(
              data
            );
          }
        }
      );
    }
  ).on(
    "error",
    async function (
      error
    ) {
      await interaction.editReply(
        "connection error, try again later"
      );
      console.error(
        error.message
      );
    }
  );
  request.end();
}

export {
  chartPlayersScore
};