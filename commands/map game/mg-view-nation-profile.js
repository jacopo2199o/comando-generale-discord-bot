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
  rgbToHex,
  getPlayersNicknames
} from "../../resources/general-utilities.js";

/**
 * @param {import("discord.js").Interaction} interaction
 */
async function view_nation_profile(
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
  const activity_points = getCalculatedPoints(
    customPoints.interactionCreate,
    reputationPoints[interaction.guildId][maker.id].points
  );
  const playerId = interaction.options.getString(
    "player-nickname"
  );
  const request = http.request(
    {
      host: "localhost",
      port: "3000",
      path: `/view_nation_profile?map_id=0&player_id=${playerId}`,
      method: "GET",
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
              color,
              nickname,
              materials,
              food,
              civilians,
              military
            } = JSON.parse(
              data
            );
            const details = `🪨 **materials:** ${materials}/10\n` +
              `🍞 **food:** ${food}/10\n` +
              `🧢 **civilians:** ${civilians}/10\n` +
              `🪖 **military:** ${military}/10\n`;
            const message = new EmbedBuilder().setTitle(
              "🗺️ map game - europe"
            ).setDescription(
              `🔶 *${nickname}* nation profile\n\n${details}`
            ).setFooter(
              {
                text: `${activity_points} ⭐ to ${maker.displayName}`,
                iconURL: `${maker.displayAvatarURL()}`
              }
            ).setColor(
              rgbToHex(
                color
              )
            ).setTimestamp();
            await interaction.followUp(
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
      await interaction.followUp(
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
      await interaction.followUp(
        "connection timeout, try again later"
      );
      console.error(
        "connection timeout"
      );
    }
  );
  request.end();
}

async function view_player_autocomplete(
  interaction
) {
  const focusedOption = interaction.options.getFocused(
    true
  );

  if (
    focusedOption.name === "player-nickname"
  ) {
    const playersNicknames = await getPlayersNicknames(
      0 // map_id
    );
    const filteredNicknames = playersNicknames.filter(
      nickname => nickname.name.toLowerCase().includes(
        focusedOption.value.toLowerCase()
      )
    ).map(
      nickname => (
        {
          name: nickname.name,
          value: nickname.value
        }
      )
    );
    await interaction.respond(
      filteredNicknames.slice(
        0, 8
      ) // massimo 25
    );
  }

  return; // esci dopo l'autocompletamento!
}

export {
  view_nation_profile,
  view_player_autocomplete
};