import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { drops } from "../resources/custom-points.js";
import { getCustomRole } from "../resources/general-utilities.js";

/**
 * @param {import("discord.js").Interaction} interaction 
 */
const takePromotionPoints = async (interaction) => {
  const takerRole = getCustomRole(interaction.member);
  let actionRow = new ActionRowBuilder();
  let takeButton = new ButtonBuilder();

  interaction.client.emit("action", interaction.member, drops.promotionPoints);

  takeButton
    .setCustomId("taken")
    .setLabel("taken")
    .setStyle(ButtonStyle.Danger)
    .setDisabled(true);

  actionRow.setComponents(takeButton);

  interaction.update({
    content: `${takerRole} *${interaction.member}* took the drop`,
    components: [actionRow]
  });
};

export { takePromotionPoints };

