import { about } from "../commands/about.js";
import { downgrade } from "../commands/downgrade.js";
import { checkLanding } from "../commands/check-landing.js";
import { clear } from "../commands/clear.js";
import { viewPromotionPoints } from "../commands/view-promotion-points.js";
import { giveReputationPoint } from "../commands/give-reputation-point.js";
import { viewReputationPoints } from "../commands/view-reputation-points.js";

/**
 * @param {import("discord.js").Interaction} interaction
 */
const interactionCreate = async (interaction) => {
  if (!interaction.isChatInputCommand()) {
    return;
  }

  if (interaction.commandName === "about") {
    about(interaction);
  } else if (interaction.commandName === "check-landing") {
    checkLanding(interaction);
  } else if (interaction.commandName === "clear") {
    clear(interaction);
  } else if (interaction.commandName === "downgrade") {
    downgrade(interaction);
  } else if (interaction.commandName === "give-reputation-point") {
    giveReputationPoint(interaction);
  } else if (interaction.commandName === "view-promotion-points") {
    viewPromotionPoints(interaction);
  } else if (interaction.commandName === "view-reputation-points") {
    viewReputationPoints(interaction);
  } else {
    console.error(`no command matching ${interaction.commandName} was found`);
    return interaction.reply({ content: `invalid command /${interaction.commandName}`, ephemeral: true });
  }
};

export { interactionCreate };