import Canvas from "canvas";
import { AttachmentBuilder } from "discord.js";
import { customChannels } from "./resources/custom-channels.js";

/**
 * @param {import("discord.js").Guild} guild 
 */
const canvasMain = async (guild) => {
  const canvas = Canvas.createCanvas(200, 200);
  const ctx = canvas.getContext("2d");
  // Write "Awesome!"
  ctx.font = "30px Impact";
  ctx.rotate(0.1);
  ctx.fillText("Awesome!", 50, 100);
  // Draw line under text
  var text = ctx.measureText("Awesome!");
  ctx.strokeStyle = "rgba(0,0,0,0.5)";
  ctx.beginPath();
  ctx.lineTo(50, 102);
  ctx.lineTo(50 + text.width, 102);
  ctx.stroke();
  const image = new AttachmentBuilder(canvas.toBuffer(), { name: "test.png" });
  const channel = guild.channels.cache.find((channel) => channel.name === customChannels.internal)
    ?? guild.channels.cache.get(guild.channels.publicUpdatesChannelId);
  const messageSent = await channel.send({ files: [image] });
  setTimeout(() => {
    messageSent.delete();
  }, 4000);
};

export { canvasMain };

