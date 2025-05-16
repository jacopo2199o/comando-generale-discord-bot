import {
  EmbedBuilder
} from "discord.js";
import http from "node:http";
/**
 * @param {import("discord.js").Interaction} interaction
 */
async function leaderboard(
  interaction
) {
  const allowed_channels = [
    "1168970952311328768",
    "1165937736121860198"
  ];

  if (
    !allowed_channels.includes(
      interaction.channelId
    )
  ) {
    await interaction.reply(
      {
        content: "*map game* commands can only be used in *int-roleplay* channel",
        ephemeral: true
      }
    );
    return;
  }

  await interaction.deferReply();
  const request = http.request(
    {
      host: "localhost",
      port: "3000",
      path: "/map/players?map_id=0",
      method: "GET",
    },
    response => {
      let data = "";
      response.on(
        "data",
        chunk => data += chunk
      ).on(
        "end",
        async () => {
          if (
            response.statusCode == 200
          ) {
            const playersStatistics = JSON.parse(
              data
            ).sort(
              (
                a,
                b
              ) => b.score - a.score
            );
            const sortedChart = playersStatistics.slice(
              0,
              10
            );
            let row = "";
            sortedChart.forEach(
              (
                element,
                index
              ) => {
                row += `${index + 1}: *${element.nickname}* with ${element.score} score ⭐\n`;
              }
            );

            if (
              playersStatistics.length === 0
            ) {
              return;
            }

            const message = new EmbedBuilder().setTitle(
              "🗺️ map game - europe"
            ).setDescription(
              `🏆 top 10 players leaderboard\n\n${row}`
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
    async error => {
      await interaction.editReply(
        "connection error, try again later"
      );
      console.error(
        error.message
      );
    }
  ).on(
    "timeout",
    async () => {
      request.destroy();
      await interaction.editReply(
        "connection timeout, try again later"
      );
      console.error(
        "connection timeout"
      );
    }
  );
  request.end();
}

export {
  leaderboard
};