import { EmbedBuilder } from "discord.js";
import { customChannels } from "../resources/custom-channels.js";
import { customPoints, getCalculatedPoints } from "../resources/custom-points.js";
import { getCustomRole } from "../resources/custom-roles.js";
import { referrals, reputationPoints } from "./ready.js";

/**
 * @param { import("discord.js").Invite } invite
 */
const inviteCreate = async (invite) => {
  referrals[invite.code] = invite.uses;
  const maker = invite.guild.members.cache.get(invite.inviter.id);

  if (maker === undefined) {
    return console.error(maker);
  }

  const makerRole = getCustomRole(maker);

  if (makerRole === undefined) {
    return console.error(makerRole);
  }

  const makerPoints = getCalculatedPoints(customPoints.inviteCreate, reputationPoints[maker.guild.id][maker.id].points);
  invite.client.emit("activity", maker, makerPoints);
  const message = new EmbedBuilder();
  message.setTitle("🔗 new invite");
  message.setDescription(`${makerRole} *${maker}* created an invite`);
  message.addFields({ name: "promotion points", value: `${makerPoints} ⭐`, inline: true });
  message.addFields({ name: "to", value: `${maker}`, inline: true });
  message.setThumbnail(maker.displayAvatarURL({ dynamic: true }));
  message.setTimestamp();
  message.setColor(makerRole.color);
  const channel = invite.guild.channels.cache.find((channel) => channel.name === customChannels.activity)
    ?? invite.guild.publicUpdatesChannel;
  channel.send({ embeds: [message] });
};

export { inviteCreate };

