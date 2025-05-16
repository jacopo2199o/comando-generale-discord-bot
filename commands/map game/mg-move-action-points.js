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
import {
  getProvinceNames
} from "../../resources/general-utilities.js";
import http from "node:http";

/**
 * @param {import("discord.js").Interaction} interaction
 */
async function moveActionPoints(
  interaction
) {
  // aggiungi gli id dei canali consentiti
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
  const maker = interaction.member;
  const role = getCustomRole(
    maker
  );
  const activity_points = getCalculatedPoints(
    customPoints.interactionCreate,
    reputationPoints[interaction.guildId][maker.id].points
  );

  const request = http.request(
    {
      host: "localhost",
      port: "3000",
      path: "/move_action_points?map_id=0",
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
              sender,
              receiver,
              from,
              to,
              action_points,
              cost
            } = JSON.parse(
              data
            );
            const point_s = action_points > 1
              ? "points"
              : "point";
            const description = sender.nickname === receiver.nickname
              ? `👤 *${sender.nickname}* moves ${action_points} *action ${point_s}* from *${from}* to *${to}*`
              : `👤 *${sender.nickname}* moves ${action_points} *action ${point_s}* from *${from}* to *${to}* of *${receiver.nickname}*`;
            const message = new EmbedBuilder().setTitle(
              "🗺️ map game - europe"
            ).setDescription(
              description
            ).addFields(
              {
                name: "operation cost",
                value: `${cost} 🪙`,
                inline: false
              }
            ).setFooter(
              {
                text: `${activity_points} ⭐ to ${maker.displayName}`,
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
    async error => {
      await interaction.editReply(
        "connection error, try again later"
      );
      console.error(
        `connection error, try again later: ${error.message}`,
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
  request.write(
    JSON.stringify(
      {
        player_id: maker.id,
        from_province: interaction.options.getString(
          "from-province"
        ),
        to_province: interaction.options.getString(
          "to-province"
        ),
        action_points: interaction.options.getNumber(
          "action-points"
        )
      }
    )
  );
  request.end();
}

async function moveActionPointsAutocomplete(
  interaction
) {
  const focusedOption = interaction.options.getFocused(
    true
  );

  if (
    focusedOption.name === "from-province" ||
    focusedOption.name === "to-province"
  ) {
    const provinceNames = await getProvinceNames(
      0 // map_id
    );
    const filteredProvinces = provinceNames.filter(
      province => province.name.toLowerCase().includes(
        focusedOption.value.toLowerCase()
      )
    ).map(
      province => (
        {
          name: province.name,
          value: province.value
        }
      )
    );
    await interaction.respond(
      filteredProvinces.slice(
        0, 8
      ) // massimo 25
    );
  }

  return; // esci dopo l'autocompletamento!
}

export {
  moveActionPoints,
  moveActionPointsAutocomplete
};