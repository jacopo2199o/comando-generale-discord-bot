import http from "node:http";
import {getCustomRole} from "../../resources/custom-roles.js";
import {customPoints} from "../../resources/custom-points.js";
import {reputationPoints} from "../../events/ready.js";
import {getCalculatedPoints} from "../../resources/custom-points.js";
import {getPlayersNicknames} from "../../resources/general-utilities.js";
import {EmbedBuilder} from "discord.js";

const test_map_id = 0;

async function donateProvince(
  interaction
) {
  // aggiungi gli ID dei canali consentiti
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

  const maker = interaction.member;
  const role = getCustomRole(
    interaction.member
  );
  const roleColor = role ? role.color : "#FFFFFF";
  const points = getCalculatedPoints(
    customPoints.interactionCreate,
    reputationPoints[maker.guild.id][maker.id].points
  );
  const provinceName = interaction.options.getString(
    "province-name"
  );
  const receiverId = interaction.options.getString(
    "player-nickname"
  );

  try {
    await interaction.deferReply();
    const result = await sendRequest(
      test_map_id,
      interaction.user.id,
      provinceName,
      receiverId
    );

    // se la risposta è una stringa game logic error
    if (
      typeof result === "string"
    ) {
      await interaction.editReply(
        result
      );
      return;
    }

    const message = new EmbedBuilder().setDescription(
      `🗺️ map game - europe: 📜 *${result.donor}* donate *${result.province}* to *${result.receiver}*`
    ).setFooter({
      text: `${points} ⭐ to ${maker.displayName}`,
      iconURL: `${maker.displayAvatarURL()}`
    }).setColor(
      roleColor
    ).setTimestamp();
    await interaction.editReply({
      embeds: [
        message
      ]
    });
  } catch (
  __error
  ) {
    console.error("mg-donate-province failed:", __error);
    let errorMessage = "something goes wrong. try again later";

    // gestione specifica degli errori
    if (__error === "request timeout") {
      errorMessage = "the server took too long to respond. please try again later.";
    } else if (__error.message) {
      errorMessage = __error.message;
    }

    await interaction.editReply(
      errorMessage
    );
  }
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
      test_map_id
    );
    const filteredPlayers = players.filter(
      player => player.name.toLowerCase().includes(focusedOption.value.toLowerCase())
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
        0,
        8
      ) // massimo 25
    );
  }
  return; // esci dopo l'autocompletamento!
}

function sendRequest(
  mapId,
  donorId,
  provinceName,
  receiverId
) {
  return new Promise(
    (
      resolve,
      reject
    ) => {
      const data = JSON.stringify(
        {
          map_id: mapId,
          donor_id: donorId,
          receiver_id: receiverId,
          province_name: provinceName,
        }
      );
      const req = http.request(
        {
          host: "localhost",
          port: 3000,
          path: "/donate_province",
          method: "POST",
          headers: {"content-type": "application/json"},
          timeout: 5000
        },
        res => {
          let responseData = "";
          res.on(
            "data",
            chunk => (responseData += chunk)
          ).on(
            "end",
            () => {
              if (
                res.headers["content-type"].includes(
                  "application/json"
                )
              ) {
                resolve(
                  JSON.parse(
                    responseData
                  )
                );
              } else {
                resolve(
                  responseData
                );
              }
            }
          );
        }
      ).on(
        "error",
        reject
      ).on(
        "timeout",
        () => {
          req.destroy();
          reject(
            "request timeout"
          );
        }
      );
      req.write(
        data
      );
      req.end();
    }
  );
}

export {
  donateProvince,
  donateProvinceAutocomplete
};