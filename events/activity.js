import { EmbedBuilder } from "discord.js";
import { customChannels } from "../resources/custom-channels.js";
import { customPoints } from "../resources/custom-points.js";
import { downgrade, getCustomRole, upgrade } from "../resources/custom-roles.js";
import { globalPoints } from "./ready.js";

/**
 * @param { import("discord.js").GuildMember } member
 * @param { Number } points
 */
const activity = async (member, points) => {
  const channel = member.guild.channels.cache.find((channel) => channel.name === customChannels.activity)
    || member.guild.channels.cache.get(member.guild.publicUpdatesChannelId);
  const memberLevel = Math.floor(globalPoints[member.guild.id][member.id] / customPoints.promotionPoints) + 1;
  const message1 = new EmbedBuilder();
  const message2 = new EmbedBuilder();
  const pointsRing = (globalPoints[member.guild.id][member.id] % customPoints.promotionPoints) + points;
  const role = getCustomRole(member);

  let downgradeResult = undefined;
  let upgradeResult = undefined;

  globalPoints[member.guild.id][member.id] += points;

  if (member.id === member.guild.ownerId) return;

  if (pointsRing < 0) {
    if (memberLevel < 24) {
      if (role.name !== "membro") {
        globalPoints[member.guild.id][member.id] = customPoints.promotionPoints + pointsRing;
      } else {
        globalPoints[member.guild.id][member.id] = 0;
      }

      downgradeResult = downgrade(member);

      if (downgradeResult !== undefined) {
        message1
          .setTitle("🔰 downgrade")
          .setDescription(`*${member}* lost ${customPoints.promotionPoints} *promotion points*`)
          .addFields({
            name: "old role",
            value: `${downgradeResult.oldRole}`,
            inline: true
          })
          .addFields({
            name: "new role",
            value: `${downgradeResult.newRole}`,
            inline: true
          })
          .setThumbnail(member.displayAvatarURL({ dynamic: true }))
          .setTimestamp()
          .setColor("DarkRed");

        channel.send({ embeds: [message1] });
      }
    } else {
      globalPoints[member.guild.id][member.id] = customPoints.promotionPoints + pointsRing;
    }
  } else {
    if (pointsRing >= customPoints.promotionPoints) {
      upgradeResult = upgrade(member);

      if (upgradeResult !== undefined) {
        message2
          .setTitle("🔰 promotion")
          .setDescription(`*${member}* reached ${customPoints.promotionPoints} *promotion points*`)
          .addFields({
            name: "old role",
            value: `${upgradeResult.oldRole}`,
            inline: true
          })
          .addFields({
            name: "new role",
            value: `${upgradeResult.newRole}`,
            inline: true
          })
          .setThumbnail(member.displayAvatarURL({ dynamic: true }))
          .setTimestamp()
          .setColor("DarkGreen");

        channel.send({ embeds: [message2] });
      }
    }

    globalPoints[member.guild.id][member.id] += points;
  }
};

export { activity };

