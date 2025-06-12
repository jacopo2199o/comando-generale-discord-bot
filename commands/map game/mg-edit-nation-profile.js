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
/**
 * @param {import("discord.js").Interaction} interaction
 */
async function set_nation_profile(
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
  const activity_points = getCalculatedPoints(
    customPoints.interactionCreate,
    reputationPoints[interaction.guildId][maker.id].points
  );
  const request = http.request(
    {
      host: "localhost",
      port: "3000",
      path: "/set_nation_profile?map_id=0",
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
              resources,
              population,
              materials,
              food,
              civilians,
              military
            } = JSON.parse(
              data
            );
            const details = `⛰️ **resources:** ${resources}/10\n` +
              `👤 **population:** ${population}/10\n` +
              `🪨 **materials:** ${materials}/10\n` +
              `🍞 **food:** ${food}/10\n` +
              `🧢 **civilians:** ${civilians}/10\n` +
              `🪖 **military:** ${military}/10`;
            const message = new EmbedBuilder().setTitle(
              "🗺️ map game - europe"
            ).setDescription(
              `🔶 *${player_nickname}* edited his nation profile\n\n${details}`
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
        resources_population: interaction.options.getNumber(
          "resources-population"
        ),
        materials_food: interaction.options.getNumber(
          "materials-food"
        ),
        civilians_military: interaction.options.getNumber(
          "civilians-military"
        )
      }
    )
  );
  request.end();
}

export {
  set_nation_profile
};