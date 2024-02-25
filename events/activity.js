import { EmbedBuilder } from "discord.js";
import { customChannels } from "../resources/custom-channels.js";
import { customPoints } from "../resources/custom-points.js";
import { downgrade, getCustomRole, upgrade } from "../resources/custom-roles.js";
import { globalPoints, pointsLastMove } from "./ready.js";

/**
 * @param { import("discord.js").GuildMember } member
 * @param { Number } points
 */
const activity = async (member, points) => {
  const channel = member.guild.channels.cache.find((channel) => channel.name === customChannels.activity)
    ?? member.guild.publicUpdatesChannel;
  const role = getCustomRole(member);

  if (role === undefined) {
    return;
  }

  const pointsRing = (globalPoints[member.guild.id][member.id] % customPoints.promotionPoints) + points;

  if (pointsRing < 0) {
    const level = Math.floor(globalPoints[member.guild.id][member.id] / customPoints.promotionPoints) + 1;

    if (level < 24) {
      if (role.name !== "membro") {
        globalPoints[member.guild.id][member.id] += points;
        pointsLastMove[member.guild.id][member.id] = -1;
      } else {
        globalPoints[member.guild.id][member.id] = 0;
        pointsLastMove[member.guild.id][member.id] = 0;
      }

      const downgradeResult = downgrade(member);

      if (downgradeResult !== undefined) {
        const message1 = new EmbedBuilder();
        message1.setTitle("🔰 downgrade");
        message1.setDescription(`*${member}* no longer have *promotion points* for ${downgradeResult.oldRole}`);
        message1.addFields({ name: "old role", value: `${downgradeResult.oldRole}`, inline: true });
        message1.addFields({ name: "new role", value: `${downgradeResult.newRole}`, inline: true });
        message1.setThumbnail(member.displayAvatarURL({ dynamic: true }));
        message1.setTimestamp();
        message1.setColor("DarkRed");
        channel.send({ embeds: [message1] });
      }
    } else {
      globalPoints[member.guild.id][member.id] = customPoints.promotionPoints + pointsRing;
    }
  } else {
    globalPoints[member.guild.id][member.id] += points;
    pointsLastMove[member.guild.id][member.id] = 1;

    if (pointsRing >= customPoints.promotionPoints) {
      const upgradeResult = upgrade(member);

      if (upgradeResult !== undefined) {
        const message2 = new EmbedBuilder();
        message2.setTitle("🔰 promotion");
        message2.setDescription(`*${member}* reached ${customPoints.promotionPoints} *promotion points*`);
        message2.addFields({ name: "old role", value: `${upgradeResult.oldRole}`, inline: true });
        message2.addFields({ name: "new role", value: `${upgradeResult.newRole}`, inline: true });
        message2.setThumbnail(member.displayAvatarURL({ dynamic: true }));
        message2.setTimestamp();
        message2.setColor("DarkGreen");
        channel.send({ embeds: [message2] });
      }
    }
  }
};

export { activity };

