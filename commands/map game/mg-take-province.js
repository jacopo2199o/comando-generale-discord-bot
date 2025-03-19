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
  // Aggiungi gli ID dei canali consentiti
  const allowed_channels = [
    "1168970952311328768",
    "1165937736121860198"
  ];
  if (
    !allowed_channels.includes(
      interaction.channelId
    )
  ) {
    await interaction.reply({
      content: "*map game* commands can only be used in *int-roleplay* channel",
      ephemeral: true
    });
    return;
  }
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
            const {
              name,
              province,
              attacker,
              defender,
              damage
            } = JSON.parse(
              data
            );
            let description = "";
            if (
              name == "failed"
            ) {
              description = `⚔️ *${attacker}* failed to conquer *${province}* of *${defender}*: defense lost ${damage} *action points*`;
            } else if (
              name == "occupied"
            ) {
              description = `🛖 *${attacker}* occupied *${province}*`;
            } else if (
              name == "reinforced"
            ) {
              description = `🛡️ *${attacker}* reinforced *${province}*`;
            } else if (
              name == "conquered"
            ) {
              description = `🔥 *${attacker}* conquered *${province}* of *${defender}*`;
            } else if (
              name == "defeated"
            ) {
              description = `💀 *${attacker}* conquered *${province}* last province of ${defender}. if no action is taken, next hour he will be declared defeated`;
            }
            const message = new EmbedBuilder().setDescription(
              `🗺️ map game - europe: ${description}`
            ).setFooter({
              text: `${points} ⭐ to ${maker.displayName}`,
              iconURL: `${maker.displayAvatarURL()}`
            }).setColor(
              role.color
            ).setTimestamp();
            await interaction.editReply({
              embeds: [
                message
              ]
            });
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