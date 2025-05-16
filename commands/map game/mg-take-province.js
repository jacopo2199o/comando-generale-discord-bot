import {
  EmbedBuilder
} from "discord.js";
import http from "node:http";
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

async function takeProvince(
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
  const maker = interaction.member;
  const role = getCustomRole(
    maker
  );
  const activityPoints = getCalculatedPoints(
    customPoints.interactionCreate,
    reputationPoints[interaction.guildId][maker.id].points
  );
  const request = http.request(
    {
      host: "localhost",
      port: "3000",
      path: "/set_province?map_id=0",
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
              name,
              province,
              attacker,
              defender,
              defenderId,
              damage
            } = JSON.parse(
              data
            );
            const responses = {
              failed: `⚔️ *${attacker}* failed to conquer *${province}* of *${defender}*: defense lost ${damage} *action points*`,
              occupied: `🛖 *${attacker}* occupied *${province}*`,
              reinforced: `🛡️ *${attacker}* reinforced *${province}*`,
              conquered: `🔥 *${attacker}* conquered *${province}* of *${defender}*`,
              defeated: `💀 *${attacker}* conquered *${province}* last province of ${defender}. if no action is taken, next hour he will be declared defeated`
            };
            const description = responses[name];
            const message = new EmbedBuilder().setTitle(
              "🗺️ map game - europe"
            ).setDescription(
              description
            ).setFooter(
              {
                text: `${activityPoints} ⭐ to ${maker.displayName}`,
                iconURL: `${maker.displayAvatarURL()}`
              }
            ).setColor(
              role.color
            ).setTimestamp();
            await interaction.editReply(
              {
                content: defender ? `<@${defenderId}> is under attack` : null, // menziona il difensore se esiste
                allowedMentions: {
                  repliedUser: defender ? false : undefined
                },
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
        "connection error, please try again later"
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
        "mg-take-province: connection timeout"
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

async function takeProvinceAutocomplete(
  interaction
) {
  const focusedOption = interaction.options.getFocused(
    true
  );

  if (
    focusedOption.name === "province-name"
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
  takeProvince,
  takeProvinceAutocomplete
};
