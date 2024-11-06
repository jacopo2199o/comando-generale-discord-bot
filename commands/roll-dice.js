import {
  EmbedBuilder
} from "discord.js";
import {
  reputationPoints
} from "../events/ready.js";
import {
  customPoints,
  getCalculatedPoints
} from "../resources/custom-points.js";
import {
  getCustomRole
} from "../resources/custom-roles.js";

/**
 * @param {import("discord.js").Interaction} interaction
 */
async function rollDice(
  interaction
) {
  const maker = interaction.member;
  if (
    maker === undefined
  ) {
    return console.error("roll dice: maker undefined");
  }
  await interaction.deferReply();
  function roll() {
    const result = Math.random() * 10;
    if (
      result > 1 &&
      result < 6
    ) {
      return Math.round(
        result
      );
    } else {
      return roll();
    }
  }
  const role = getCustomRole(
    maker
  );
  const result = roll();
  const points = getCalculatedPoints(
    customPoints.interactionCreate,
    reputationPoints[maker.guild.id][maker.id].points
  );
  const message = new EmbedBuilder().setDescription(
    `${role} *${maker}* rolled a dice`
  ).addFields(
    {
      name: "result",
      value: `${result} 🎲`
    }
  ).setFooter(
    {
      text: `${points} ⭐ to ${maker.displayName}`,
      iconURL: `${maker.displayAvatarURL()}`
    }
  ).setColor(
    role.color
  ).setTimestamp();
  await interaction.editReply(
    {
      embeds: [
        message
      ]
    }
  );
}

export {
  rollDice
};

