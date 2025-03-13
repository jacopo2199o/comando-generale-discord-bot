import http from "node:http";
import Canvas from "canvas";
import {
  AttachmentBuilder
} from "discord.js";
import {
  Image
} from "canvas";

/**
 * @param {import("discord.js").Interaction} interaction
 */
async function viewMap(
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
  const request = http.request(
    {
      host: "localhost",
      port: "3000",
      path: "/map?id=0",
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
            const base_64_uri = Buffer.from(
              data
            ).toString(
              "base64"
            );
            let canvas = undefined;
            const image = new Image();
            image.onload = function () {
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
  viewMap
};