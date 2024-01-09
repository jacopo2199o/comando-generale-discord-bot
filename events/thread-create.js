import { EmbedBuilder } from "discord.js";
import { customChannels } from "../resources/custom-channels.js";
import { customRoles } from "../resources/custom-roles.js";

/**
 * @param { import("discord.js").ThreadChannel } thread
 * @param { Boolean } newlyCreated
 */
const threadCreate = async (thread, newlyCreated) => {
  const threadOwner = await thread.fetchOwner();
  const customChannel = thread.guild.channels.cache.find((channel) => channel.name === customChannels.welcome);

  if (newlyCreated) {
    let customRoleColor = undefined;
    let customRole = undefined;

    threadOwner.guildMember.roles.cache.forEach((role) => {
      const rankIndex = customRoles.findIndex((rank) => rank === role.name);

      if (rankIndex !== -1) {
        customRoleColor = role.color;
        customRole = role;
      }
    });

    thread.client.emit("activity", threadOwner.guildMember, 100);

    const embedMessage = new EmbedBuilder()
      .setDescription(`🧵 ${customRole} *${threadOwner.guildMember}* created *${thread.name}* thread in *${thread.parent.name}*\n`)
      .addFields({ name: "promotion points", value: "+100", inline: true })
      .setThumbnail(threadOwner.guildMember.user.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(customRoleColor);

    customChannel.send({ embeds: [embedMessage] });
  }
};

export { threadCreate };