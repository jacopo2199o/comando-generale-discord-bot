import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { drops } from "../resources/custom-points.js";
import { getCustomRole } from "../resources/general-utilities.js";

/**
 * @param {import("discord.js").Interaction} interaction 
 */
const takePromotionPoints = async (interaction) => {
  const takerRole = getCustomRole(interaction.member);
  let actionRow = new ActionRowBuilder();
  let button = new ButtonBuilder();

  interaction.client.emit("activity", interaction.member, drops.promotionPoints);

  actionRow.setComponents(
    button
      .setCustomId("taken")
      .setLabel("taken")
      .setStyle(ButtonStyle.Danger)
      .setDisabled(true)
  );

  interaction.update({
    content: `${takerRole} *${interaction.member}* took the drop`,
    components: [actionRow]
  });
};

export { takePromotionPoints };

