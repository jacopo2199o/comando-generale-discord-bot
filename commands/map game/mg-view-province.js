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
async function viewProvince(
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

  await interaction.deferReply(
    {
      ephemeral: true
    }
  );
  const maker = interaction.member;
  const role = getCustomRole(
    maker
  );
  const points = getCalculatedPoints(
    customPoints.interactionCreate,
    reputationPoints[interaction.guildId][maker.id].points
  );
  const provinceName = encodeURIComponent(
    interaction.options.getString(
      "province-name"
    )
  );
  const request = http.request(
    {
      host: "localhost",
      port: "3000",
      path: `/province?map_id=0&player_id=${maker.id}&province_name=${provinceName}`,
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
            const {
              action_points,
              player_nickname,
              resources,
              population,
              materials,
              food,
              civilians,
              military,
              special_resource,
              emoji
            } = JSON.parse(
              data
            );
            const description = action_points
              ? `🔷 *${provinceName}* of *${player_nickname}* province have:`
              : `🔷 *${provinceName}* of *${player_nickname}*`;
            const message = new EmbedBuilder().setTitle(
              "🗺️ map game - europe"
            ).setDescription(
              description
            ).addFields(
              {
                name: "action points",
                value: `${action_points} 🪖`
              },
              {
                name: "resources",
                value: `${resources} 🏔️`
              },
              {
                name: "population",
                value: `${population} 👤`
              },
              {
                name: "materials",
                value: `${materials} 🪨`
              },
              {
                name: "food",
                value: `${food} 🍞`
              },
              {
                name: "civilians",
                value: `${civilians} 🧢`
              },
              {
                name: "military",
                value: `${military} 🪖`
              },
              {
                name: "special resource",
                value: `${special_resource} ${emoji}`
              }
            ).setFooter(
              {
                text: `${points} ⭐ to ${maker.displayName}`,
                iconURL: `${maker.displayAvatarURL()}`
              }
            ).setColor(
              role.color
            ).setTimestamp();

            if (
              action_points
            ) {
              message.addFields(
                {
                  name: "action points",
                  value: `${action_points}`
                }
              );
            }

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
  viewProvince
};