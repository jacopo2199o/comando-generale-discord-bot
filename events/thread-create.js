import { EmbedBuilder } from "discord.js";
import { customChannels } from "../resources/custom-channels.js";
import { customPoints } from "../resources/custom-points.js";
import { getCustomRole } from "../resources/general-utilities.js";

/**
 * @param { import("discord.js").ThreadChannel } thread
 * @param { Boolean } newlyCreated
 */
const threadCreate = async (thread, newlyCreated) => {
  const threadOwner = await thread.fetchOwner();
  const customChannel = thread.guild.channels.cache.find((channel) => channel.name === customChannels.welcome);

  let embedMessage = new EmbedBuilder();

  if (newlyCreated) {
    const customRole = getCustomRole(threadOwner.guildMember);

    thread.client.emit("activity", threadOwner.guildMember, customPoints.threadCreate);

    embedMessage
      .setTitle("🧵 new thread")
      .setDescription(`${customRole} *${threadOwner.guildMember}* created *${thread.name}* thread in *${thread.parent.name}*\n`)
      .addFields({ name: "promotion points", value: `${customPoints.threadCreate} ⭐`, inline: true })
      .addFields({ name: "to", value: `${threadOwner.guildMember}`, inline: true })
      .setThumbnail(threadOwner.guildMember.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(customRole.color);

    customChannel.send({ embeds: [embedMessage] });
  }
};

export { threadCreate };
