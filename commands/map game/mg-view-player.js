import Canvas, {
  Image
} from "canvas";
import {
  AttachmentBuilder,
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
  getPlayersNicknames,
  rgbToHex
} from "../../resources/general-utilities.js";

/**
 * @param {import("discord.js").Interaction} interaction
 */
async function viewPlayer(
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
      ephemeral: false
    }
  );
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
      path: "/view_player?map_id=0",
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
            const base_64_uri = Buffer.from(
              data
            ).toString(
              "base64"
            );
            let canvas;
            const image = new Image();
            image.onload = () => {
              canvas = Canvas.createCanvas(
                image.width,
                image.height
              );
              const context = canvas.getContext(
                "2d"
              );
              context.drawImage(
                image,
                0,
                0,
                canvas.width,
                canvas.height
              );
            };
            image.src = `data:image/svg+xml;base64,${base_64_uri}`;
            const attachment = new AttachmentBuilder(
              canvas.toBuffer()
            );
            await interaction.editReply(
              {
                files: [
                  attachment
                ]
              }
            );
            const player_request = http.request(
              {
                host: "localhost",
                port: "3000",
                path: `/map/player?map_id=0&player_id=${playerId}`,
                method: "GET",
                timeout: 2900
              },
              player_response => {
                let data = "";
                player_response.on(
                  "data",
                  chunk => data += chunk
                ).on(
                  "end",
                  async () => {
                    if (
                      player_response.statusCode === 200
                    ) {
                      const {
                        id,
                        color,
                        nickname,
                        global_relationships,
                        score,
                        totals
                      } = JSON.parse(
                        data
                      );
                      const details = `✒️ **username:** <@${id}>\n` +
                        `🏳️‍🌈 **color:** ${color}\n` +
                        `🔷 **regions:** ${score}\n` +
                        `🏛️ **global relationships:** ${global_relationships}\n` +
                        `🪨 **materials:** ${totals.materials} t\n` +
                        `🍞 **food:** ${totals.food} t\n` +
                        `🧢 **civilians:** ${totals.civilians}\n` +
                        `🪖 **military:** ${totals.military}`;
                      const message = new EmbedBuilder().setTitle(
                        "🗺️ map game - europe"
                      ).setDescription(
                        `👤 *${nickname}* player\n\n${details}`
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
            player_request.end();
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
        "mg-view-player: connection timeout"
      );
    }
  );
  request.write(
    JSON.stringify(
      {
        player_id: playerId
      }
    )
  );
  request.end();
}

async function viewPlayerAutocomplete(
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
  viewPlayer,
  viewPlayerAutocomplete
};
