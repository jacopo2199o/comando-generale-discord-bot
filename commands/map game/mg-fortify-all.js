import http from "node:http";
import {
  EmbedBuilder
} from "discord.js";
import {
  reputationPoints
} from "../../events/ready.js";
import {
  customPoints,
  getCalculatedPoints
} from "../../resources/custom-points.js";
import {
  getCustomRole
} from "../../resources/custom-roles.js";
/**
 * @param {import("discord.js").Interaction} interaction
 */
async function fortifyAll(
  interaction
) {
  // aggiungi gli id dei canali consentiti
  const allowed_channels = [
    "1168970952311328768", // int-roleplay
    "1165937736121860198" // bot-testing
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
  const maker = interaction.member;
  const role = getCustomRole(
    maker
  );
  const promotionPoints = getCalculatedPoints(
    customPoints.interactionCreate,
    reputationPoints[interaction.guildId][maker.id].points
  );
  const request = http.request(
    {
      host: "localhost",
      port: "3000",
      path: "/fortify-all?map_id=0",
      method: "POST",
      timeout: 2900
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
            response.statusCode === 200
          ) {
            const {
              player_1_id,
              player_1_nickname,
              player_2_id,
              player_2_nickname,
              action_points
            } = JSON.parse(
              data
            );
            const pointString = action_points > 1
              ? "points"
              : "point";
            const messageDescription = player_1_id === player_2_id
              ? `🛡️ *${player_1_nickname}* has fortified its territories by ${action_points} *action ${pointString}*`
              : `🛡️ *${player_1_nickname}* has fortified territories of *${player_2_nickname}* by ${action_points} *action ${pointString}*`;
            const message = new EmbedBuilder().setTitle(
              "🗺️ map game - europe"
            ).setDescription(
              messageDescription
            ).setFooter(
              {
                text: `${promotionPoints} ⭐ to ${maker.displayName}`,
                iconURL: `${maker.displayAvatarURL()}`
              }
            ).setColor(
              role.color
            ).setTimestamp();
            await interaction.editReply(
              {
                embeds: [
                  message
                ]
              }
            );

            if (
              player_1_id !== player_2_id
            ) {
              await interaction.followUp(
                {
                  content: `<@${player_2_id}>: you were reinforced by *${player_1_nickname}*`,
                }
              );
            }
          } else {
            await interaction.editReply(
              data
            );
          }
        }
      ).on(
        "error",
        async error => {
          await interaction.editReply(
            "connection error, try again later"
          );
          console.error(
            `connection error, try again later: ${error.message}`
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
    }
  );
  request.write(
    JSON.stringify(
      {
        player_1_id: maker.id,
        player_2_id: interaction.options.getString(
          "player-nickname"
        ) || maker.id,
        action_points: interaction.options.getNumber(
          "action-points"
        )
      }
    )
  );
  request.end();
}

export {
  fortifyAll
};