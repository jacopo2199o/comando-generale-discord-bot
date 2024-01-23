import { EmbedBuilder } from "discord.js";
import { customChannels } from "../resources/custom-channels.js";
import { customPoints, getCalculatedPoints } from "../resources/custom-points.js";
import { getCustomRole } from "../resources/general-utilities.js";
import { referrals, reputationPoints } from "./ready.js";

/**
 * @param { import("discord.js").Invite } invite
 */
const inviteCreate = async (invite) => {
  const channel = invite.guild.channels.cache.find((channel) => channel.name === customChannels.activity)
    || invite.guild.channels.cache.get(invite.guild.publicUpdatesChannelId);
  const embedMessage = new EmbedBuilder();
  const members = await invite.guild.members.fetch();

  let maker = undefined;
  let makerPoints = undefined;
  let makerRole = undefined;

  if (members !== undefined) {
    maker = members.get(invite.inviter.id);

    if (maker !== undefined) {
      makerPoints = getCalculatedPoints(
        customPoints.inviteCreate,
        reputationPoints[maker.guild.id][maker.id].points
      );
      makerRole = getCustomRole(maker);
    }
  }

  referrals[invite.code] = invite.uses;

  invite.client.emit("activity", maker, makerPoints);

  embedMessage
    .setTitle("🔗 new invite")
    .setDescription(`${makerRole} *${maker}* created an invite`)
    .addFields({ name: "promotion points", value: `${makerPoints} ⭐`, inline: true })
    .addFields({ name: "to", value: `${maker}`, inline: true })
    .setThumbnail(maker.displayAvatarURL({ dynamic: true }))
    .setTimestamp()
    .setColor(makerRole.color);

  channel.send({ embeds: [embedMessage] });
};

export { inviteCreate };

