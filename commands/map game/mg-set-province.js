import {EmbedBuilder} from "@discordjs/builders";
import {reputationPoints} from "../../events/ready.js";
import {customPoints, getCalculatedPoints} from "../../resources/custom-points.js";
import {getCustomRole} from "../../resources/custom-roles.js";
import {get_special_resources, getProvinceNames} from "../../resources/general-utilities.js";
import http from "node:http";
/**
 * @param {import("discord.js").Interaction} interaction
 */
async function set_province(
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
      path: "/set_province_resources?map_id=0",
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
              player_nickname,
              province_name,
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
            const message = new EmbedBuilder().setTitle(
              "🗺️ map game - europe"
            ).setDescription(
              `*${player_nickname}* edited *${province_name}*`
            ).addFields(
              {
                name: "resources",
                value: `${resources} 🏔️`,
              },
              {
                name: "population",
                value: `${population} 👤`,
              },
              {
                name: "materials",
                value: `${materials} 🪨`,
              },
              {
                name: "food",
                value: `${food} 🍞`,
              },
              {
                name: "civilians",
                value: `${civilians} 🧢`,
              },
              {
                name: "military",
                value: `${military} 🪖`,
              },
              {
                name: "special resource",
                value: `${special_resource} ${emoji}`,
              }
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
        player_id: interaction.user.id,
        province_name: interaction.options.getString(
          "province-name"
        ),
        resources_population: interaction.options.getNumber(
          "resources-population"
        ),
        materials_food: interaction.options.getNumber(
          "materials-food"
        ),
        civilians_military: interaction.options.getNumber(
          "civilians-military"
        ),
        special_resource: interaction.options.getString(
          "special-resource"
        )
      }
    )
  );
  request.end();
}

async function set_province_autocomplete(
  interaction
) {
  const focused_option = interaction.options.getFocused(
    true
  );

  if (
    focused_option.name === "province-name"
  ) {
    const provinceNames = await getProvinceNames(
      0 // map_id
    );
    const filteredProvinces = provinceNames.filter(
      province => province.name.toLowerCase().includes(
        focused_option.value.toLowerCase()
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
  } else if (
    focused_option.name === "special-resource"
  ) {
    const special_resources = await get_special_resources(
      0 // map_id
    );
    const filtered_special_resources = special_resources.filter(
      special_resource => special_resource.name.toLowerCase().includes(
        focused_option.value.toLowerCase()
      )
    );
    await interaction.respond(
      filtered_special_resources.slice(
        0, 20
      ) // massimo 25
    );
  }

  return; // esci dopo l'autocompletamento!
}

export {
  set_province,
  set_province_autocomplete
};