import {
  EmbedBuilder
} from "discord.js";
import {
  globalPoints
} from "../events/ready.js";
import {
  customPoints,
  getLevel
} from "../resources/custom-points.js";
import {
  getCustomRole
} from "../resources/custom-roles.js";

/**
 * @param {import("discord.js").Interaction} interaction
 */
async function viewPromotionPoints(
  interaction
) {
  await interaction.deferReply();
  const user = interaction.options.getUser(
    "member"
  );
  const member = interaction.guild.members.cache.get(
    user?.id
  ) ?? interaction.guild.members.cache.get(
    interaction.member.id
  );
  if (
    member === undefined
  ) {
    return console.error(
      "view promotions points: member undefined"
    );
  }
  const role = getCustomRole(
    member
  );
  if (role === undefined) {
    return console.error(
      "view promotions points: role undefined"
    );
  }
  const points = globalPoints[member.guild.id][member.id] % customPoints.promotionPoints;
  const level = getLevel(
    member
  );
  if (
    user !== null
  ) {
    const message = new EmbedBuilder();
    message.setTitle(
      "⭐ promotion points"
    );
    message.setDescription(
      `${role} *${member}* have ${points}/${customPoints.promotionPoints} (lvl. ${level}) *promotion points*`
    );
    message.setThumbnail(
      member.displayAvatarURL(
        {
          dynamic: true
        }
      )
    );
    message.setTimestamp();
    message.setColor(
      role.color
    );
    await interaction.editReply(
      {
        embeds: [
          message
        ]
      }
    );
  } else {
    const message = new EmbedBuilder();
    message.setTitle(
      "⭐ promotion points"
    );
    message.setDescription(
      `you have ${points}/${customPoints.promotionPoints} (lvl. ${level}) *promotion points*`
    );
    message.setThumbnail(
      interaction.member.displayAvatarURL(
        {
          dynamic: true
        }
      )
    );
    message.setTimestamp();
    message.setColor(
      role.color
    );
    await interaction.editReply(
      {
        embeds: [
          message
        ]
      }
    );
  }
}

export {
  viewPromotionPoints
};

