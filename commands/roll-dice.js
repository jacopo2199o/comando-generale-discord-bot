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
    let result = Math.random() * 10;
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
  const message = new EmbedBuilder();
  const role = getCustomRole(
    maker
  );
  message.setDescription(
    `${role} *${maker}* rolled a dice`
  );
  const result = roll();
  message.addFields(
    {
      name: "result",
      value: `${result} 🎲`
    }
  );
  message.setTimestamp();
  const points = getCalculatedPoints(
    customPoints.interactionCreate,
    reputationPoints[maker.guild.id][maker.id].points
  );
  message.setFooter(
    {
      text: `${points} ⭐ to ${maker.displayName}`,
      iconURL: `${maker.displayAvatarURL()}`
    }
  );
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

export {
  rollDice
};

