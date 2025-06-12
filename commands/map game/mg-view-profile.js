import {
  createCanvas,
  loadImage
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
  getCustomRole
} from "../../resources/custom-roles.js";

/**
 * @param {import("discord.js").Interaction} interaction
 */
async function viewProfile(
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
  const activity_points = getCalculatedPoints(
    customPoints.interactionCreate,
    reputationPoints[interaction.guildId][maker.id].points
  );
  const request = http.request(
    {
      host: "localhost",
      port: "3000",
      path: `/map/player?map_id=0&player_id=${maker.id}`,
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
              nickname,
              points,
              global_relationships,
              score
            } = JSON.parse(
              data
            );
            const message = new EmbedBuilder().setTitle(
              "🗺️ map game - europe"
            ).setDescription(
              `👤 *${nickname}* has:`
            ).addFields(
              {
                name: "action points",
                value: `${points}`,
                inline: true
              }
            ).addFields(
              {
                name: "global relationships",
                value: `${global_relationships}`,
                inline: true
              }
            ).addFields(
              {
                name: "score",
                value: `${score}`,
                inline: false
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
            const imageRequest = http.request(
              {
                host: "localhost",
                port: "3000",
                path: `/view_action_points_map?map_id=0&player_id=${maker.id}`,
                method: "GET",
                timeout: 2900
              },
              imageResponse => {
                let imageData = "";
                imageResponse.on(
                  "data",
                  chunk => imageData += chunk
                ).on(
                  "end",
                  async () => {
                    if (
                      imageResponse.statusCode === 200
                    ) {
                      try {
                        // converti l'svg in png
                        const canvas = createCanvas(
                          800,
                          600
                        );
                        const context = canvas.getContext(
                          "2d"
                        );
                        const image = await loadImage(
                          `data:image/svg+xml;base64,${Buffer.from(imageData).toString("base64")}`
                        );
                        context.drawImage(
                          image,
                          0,
                          0,
                          canvas.width,
                          canvas.height
                        );
                        // ottieni il buffer png
                        const pngBuffer = canvas.toBuffer(
                          "image/png"
                        );
                        // invia l'immagine come allegato
                        const attachment = new AttachmentBuilder(
                          pngBuffer,
                          {
                            name: "profile.png"
                          }
                        );
                        await interaction.followUp(
                          {
                            content: "action points map (brighter regions have more action points)",
                            files: [
                              attachment
                            ],
                            ephemeral: true
                          }
                        );
                      } catch (__error) {
                        console.error(
                          "error rendering svg to png:", __error
                        );
                        await interaction.followUp(
                          {
                            content: "failed to render the svg as an image",
                            ephemeral: true
                          }
                        );
                      }
                    } else {
                      await interaction.followUp(
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
            imageRequest.end();
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
  request.end();
}

export {
  viewProfile
};

