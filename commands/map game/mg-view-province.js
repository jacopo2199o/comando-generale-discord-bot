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
  // Aggiungi gli ID dei canali consentiti
  const allowed_channels = ["1168970952311328768", "1165937736121860198"];
  if (!allowed_channels.includes(interaction.channelId)) {
    await interaction.reply({
      content: "*map game* commands can only be used in *int-roleplay* channel",
      ephemeral: true
    });
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
  const provinceName = interaction.options.getString("province-name");
  const request = http.request(
    {
      host: "localhost",
      port: "3000",
      path: `/province?map_id=0&player_id=${maker.id}&province_name=${provinceName}`,
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
            if (
              data == "not your province"
            ) {
              await interaction.editReply(
                data
              );
              return;
            }
            const message = new EmbedBuilder().setTitle(
              "🗺️ map game - europe"
            ).setDescription(
              `🛖 *${provinceName}* province has:`
            ).addFields(
              {
                name: "action points",
                value: `${data}`,
                inline: true
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
  request.end();
}

export {
  viewProvince
};