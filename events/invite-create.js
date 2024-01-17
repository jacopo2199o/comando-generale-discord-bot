import { EmbedBuilder } from "discord.js";
import { customChannels } from "../resources/custom-channels.js";
import { customPoints } from "../resources/custom-points.js";
import { getCustomRole } from "../resources/general-utilities.js";
import { referrals } from "./ready.js";

/**
 * @param { import("discord.js").Invite } invite
 */
const inviteCreate = async (invite) => {
  const customChannel = invite.guild.channels.cache.find((channel) => channel.name === customChannels.activity);
  const embedMessage = new EmbedBuilder();
  const customRole = getCustomRole(
    invite.guild.members.cache.get(invite.inviter.id)
  );
  const guildMember = invite.guild.members.cache.get(invite.inviter.id);

  await invite.guild.invites.fetch();

  referrals[invite.code] = invite.uses;

  invite.client.emit("activity", guildMember, customPoints.inviteCreate);

  embedMessage
    .setTitle("🔗 new invite")
    .setDescription(`${customRole} *${guildMember}* created an invite`)
    .addFields({ name: "promotion points", value: `${customPoints.inviteCreate} ⭐`, inline: true })
    .addFields({ name: "to", value: `${guildMember}`, inline: true })
    .setThumbnail(guildMember.displayAvatarURL({ dynamic: true }))
    .setTimestamp()
    .setColor(customRole.color);

  customChannel.send({ embeds: [embedMessage] });
};

export { inviteCreate };

