import Canvas from "canvas";
import {
  AttachmentBuilder
} from "discord.js";
import {
  customChannels
} from "./resources/custom-channels.js";
import http from "node:http";
import {
  Image
} from "canvas";

/**
 * @param {import("discord.js").Guild} guild
 */
async function canvasMain(
  guild
) {
  const canvas = Canvas.createCanvas(
    512,
    512
  );
  const context = canvas.getContext(
    "2d"
  );

  //get_new_map();

  function get_new_map() {
    http.get(
      "http://localhost:3000/new_map",
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
        );
        response.on(
          "end",
          async function () {
            await send_map(
              data
            );
          }
        );
      }
    );
  }

  async function send_map(
    data
  ) {
    const base_64_uri = Buffer.from(
      decodeURI(
        encodeURI(
          data
        )
      )
    ).toString(
      "base64"
    );
    const image = new Image();
    image.src = `data:image/svg+xml;base64,${base_64_uri}`;
    image.onload = function () {
      context.drawImage(
        image,
        0,
        0,
        canvas.width,
        canvas.height
      );
    };
    const attachment = new AttachmentBuilder(
      canvas.toBuffer()
    );
    const channel = guild.channels.cache.find(
      function (
        channel
      ) {
        return channel.name === customChannels.internal;
      }
    ) ?? guild.channels.publicUpdatesChannel;
    await channel.send(
      {
        files: [
          attachment
        ]
      }
    );
  }
}

export {
  canvasMain
};

