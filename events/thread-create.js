import { EmbedBuilder } from "discord.js";
import { customChannels } from "../resources/custom-channels.js";
import { customPoints, getCalculatedPoints } from "../resources/custom-points.js";
import { getCustomRole } from "../resources/general-utilities.js";
import { reputationPoints } from "./ready.js";

/**
 * @param { import("discord.js").ThreadChannel } thread
 * @param { Boolean } newlyCreated
 */
const threadCreate = async (thread, newlyCreated) => {
  const channel = thread.guild.channels.cache.find((channel) => channel.name === customChannels.welcome)
    || thread.guild.channels.cache.get(thread.guild.publicUpdatesChannelId);
  const embedMessage = new EmbedBuilder();
  const threadOwner = await thread.fetchOwner();

  let maker = undefined;
  let makerPoints = undefined;
  let makerRole = undefined;

  if (threadOwner !== undefined) {
    maker = threadOwner.guildMember;

    if (maker !== undefined) {
      makerRole = getCustomRole(maker);
      makerPoints = getCalculatedPoints(
        customPoints.threadCreate,
        reputationPoints[maker.guild.id][maker.id].points
      );
    }
  }

  if (newlyCreated) {
    thread.client.emit("activity", threadOwner.guildMember, makerPoints);

    embedMessage
      .setTitle("🧵 new thread")
      .setDescription(`${makerRole} *${maker}* created *${thread.name}* thread in *${thread.parent.name}*\n`)
      .addFields({ name: "promotion points", value: `${makerPoints} ⭐`, inline: true })
      .addFields({ name: "to", value: `${maker}`, inline: true })
      .setThumbnail(threadOwner.guildMember.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(makerRole.color);

    channel.send({ embeds: [embedMessage] });
  }
};

export { threadCreate };

