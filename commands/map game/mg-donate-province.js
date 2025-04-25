import http from "node:http";
import {getCustomRole} from "../../resources/custom-roles.js";
import {customPoints} from "../../resources/custom-points.js";
import {reputationPoints} from "../../events/ready.js";
import {getCalculatedPoints} from "../../resources/custom-points.js";
import {getPlayersNicknames} from "../../resources/general-utilities.js";
import {EmbedBuilder} from "discord.js";

async function donateProvince(
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
    interaction.member
  );
  const activity_points = getCalculatedPoints(
    customPoints.interactionCreate, reputationPoints[maker.guild.id][maker.id].points
  );
  const request = http.request(
    {
      host: "localhost",
      port: "3000",
      path: "/donate_province?map_id=0",
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
              donor,
              receiver,
              province,
              cost
            } = JSON.parse(
              data
            );
            const message = new EmbedBuilder().setTitle(
              "🗺️ map game - europe"
            ).setDescription(
              `📜 *${donor}* donate *${province}* to *${receiver}*`
            ).addFields(
              {
                name: "administrative cost",
                value: cost
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
            console.log(
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
            "connection timeout"
          );
        }
      );
    }
  );

  request.write(
    JSON.stringify(
      {
        donor_id: maker.id,
        receiver_id: interaction.options.getString(
          "player-nickname"
        ),
        province_name: interaction.options.getString(
          "province-name"
        ),
      }
    )
  );
  request.end();
}

async function donateProvinceAutocomplete(
  interaction
) {
  const focusedOption = interaction.options.getFocused(
    true
  );

  if (
    focusedOption.name === "player-nickname"
  ) {
    const players = await getPlayersNicknames(
      0 // map_id
    );
    const filteredPlayers = players.filter(
      player => player.name.toLowerCase().includes(
        focusedOption.value.toLowerCase()
      )
    ).map(
      player => (
        {
          name: player.name,
          value: player.value
        }
      )
    );
    await interaction.respond(
      filteredPlayers.slice(
        0, 8
      ) // massimo 25
    );
  }

  return; // esci dopo l'autocompletamento!
}

export {
  donateProvince,
  donateProvinceAutocomplete
};