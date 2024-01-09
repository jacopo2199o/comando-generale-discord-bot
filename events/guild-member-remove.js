import { EmbedBuilder } from "discord.js";
import { customChannels } from "../resources/custom-channels.js";
import { promotionPoints, globalPoints } from "./ready.js";
import { customRoles } from "../resources/custom-roles.js";

/**
* @param { import("discord.js").GuildMember } guildMember
*/
const guildMemberRemove = async (guildMember) => {
  const customChannel = guildMember.guild.channels.cache.find((channel) => channel.name === customChannels.private);

  /**
  * @type { import("discord.js").Role }
  */
  let customRole = undefined;
  let embedMessage = new EmbedBuilder();

  delete promotionPoints[guildMember.id];
  delete globalPoints[guildMember.id];

  guildMember.roles.cache.forEach((role) => {
    const rankIndex = customRoles.findIndex((rank) => rank === role.name);

    if (rankIndex !== -1) {
      customRole = role;
    }
  });

  embedMessage
    .setDescription(`🍂 ${customRole} *${guildMember}* left *comando generale*\n`)
    .setThumbnail(guildMember.displayAvatarURL({ dynamic: true }))
    .setTimestamp()
    .setColor(customRole.color || "Grey");

  customChannel.send({ embeds: [embedMessage] });
};

export { guildMemberRemove };