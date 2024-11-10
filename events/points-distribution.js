import {
  EmbedBuilder
} from "discord.js";
import {
  customChannels
} from "../resources/custom-channels.js";
import http from "node:http";

/**
 * @param {import("discord.js").Guild} guild
 */
async function pointsDistribution(
  guild
) {
  const channel = guild.channels.cache.find(
    function (
      channel
    ) {
      return channel.name === customChannels.public;
    }
  ) ?? guild.publicUpdatesChannel;
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
            );
            if (
              playersStatistics.length == 0
            ) {
              return;
            }
            let pointsDistributed = 0;
            playersStatistics.forEach(
              function (
                playerStatistics
              ) {
                pointsDistributed += playerStatistics.score;
                const member = guild.members.cache.get(
                  playerStatistics.id
                );
                guild.client.emit(
                  "activity",
                  member,
                  playerStatistics.score
                );
              }
            );
            const message = new EmbedBuilder().setTitle(
              "🗺️⭐ map game"
            ).setDescription(
              "map game points distribution to players have joined *map game, italy*"
            ).addFields(
              {
                name: "promotion points",
                value: `${pointsDistributed} ⭐`,
                inline: true
              }
            ).addFields(
              {
                name: "to",
                value: "players",
                inline: true
              }
            ).setThumbnail(
              guild.client.user.displayAvatarURL(
                {
                  dynamic: true
                }
              )
            ).setTimestamp().setColor(
              "DarkGreen"
            );
            channel.send(
              {
                embeds: [
                  message
                ]
              }
            );
          } else {
            channel.send(
              data
            );
          }
        }
      );
    }
  ).on(
    "error",
    function (
      error
    ) {
      channel.send(
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
  pointsDistribution
};

