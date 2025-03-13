import http from "node:http";
import {
  EmbedBuilder
} from "discord.js";
import {
  getCustomRole
} from "../../resources/custom-roles.js";
import {
  customPoints,
  getCalculatedPoints
} from "../../resources/custom-points.js";
import {
  reputationPoints
} from "../../events/ready.js";

/**
 * @param {import("discord.js").Interaction} interaction
 */
async function join(
  interaction
) {
  // Aggiungi gli ID dei canali consentiti
  const allowed_channels = ["1168970952311328768", "1165937736121860198"];
  if (!allowed_channels.includes(interaction.channelId)) {
    await interaction.reply({
      content: "*map game* commands can only be used in *int-roleplay* channel",
      ephemeral: true
    });
    return;
  }
  await interaction.deferReply();
  const maker = interaction.member;
  const role = getCustomRole(
    interaction.member
  );
  const points = getCalculatedPoints(
    customPoints.interactionCreate,
    reputationPoints[maker.guild.id][maker.id].points
  );
  const request = http.request(
    {
      host: "localhost",
      port: "3000",
      path: "/join_map?id=0",
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
            const message = new EmbedBuilder().setTitle(
              "🗺️ map game - europe"
            ).setDescription(
              `👑 ${role} *${maker}* joined`
            ).addFields(
              {
                name: "\u200b",
                value: "use */mg-view-map* to see the map"
              }
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
        player_nickname: interaction.options.getString(
          "nickname"
        ),
        player_color: [
          interaction.options.getNumber(
            "red"
          ),
          interaction.options.getNumber(
            "green"
          ),
          interaction.options.getNumber(
            "blue"
          )
        ]
      }
    )
  );
  request.end();
}

export {
  join
};