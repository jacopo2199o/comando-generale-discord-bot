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
import http from "node:http";

/**
 * @param {import("discord.js").Interaction} interaction
 */
async function takeProvince(
  interaction
) {
  await interaction.deferReply();
  const maker = interaction.member;
  const role = getCustomRole(
    maker
  );
  const points = getCalculatedPoints(
    customPoints.interactionCreate,
    reputationPoints[interaction.guildId][maker.id].points
  );
  const request = http.request(
    {
      host: "localhost",
      port: "3000",
      path: "/set_province?id=0",
      method: "POST",
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
            const action = JSON.parse(
              data
            );
            let description = "";
            if (
              action.name == "tried"
            ) {
              description = `🗺️⚔️ ${role} *${maker}* failed to conquer *${action.province}*`;
            } else if (
              action.name == "occupied"
            ) {
              description = `🛖 ${role} *${maker}* occupied *${action.province}*`;
            } else if (
              action.name == "reinforced"
            ) {
              description = `🛡️ ${role} *${maker}* reinforced *${action.province}*`;
            } else if (
              action.name == "conquered"
            ) {
              description = `🔥 ${role} *${maker}* conquered *${action.province}* of *${action.previous_player}*`;
            } else if (
              action.name == "defeated"
            ) {
              description = `💀 ${role} *${maker}* conquered *${action.province}* last province of ${action.previous_player}. if no action is taken, next hour he will be declared defeated`;
            }
            const message = new EmbedBuilder().setDescription(
              `🗺️ map game - europe: ${description}`
            ).setFooter(
              {
                text: `${points} ⭐ to ${maker.displayName}`,
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
  request.write(
    JSON.stringify(
      {
        player_id: maker.id,
        province_name: interaction.options.getString(
          "province-name"
        ),
        action_points: interaction.options.getNumber(
          "action-points"
        )
      }
    )
  );
  request.end();
}

export {
  takeProvince
};