import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { drops } from "../resources/custom-points.js";

/**
 * @param {import("discord.js").Interaction} interaction 
 */
const takePromotionPoints = async (interaction) => {
  const actionRow = new ActionRowBuilder();
  const button = new ButtonBuilder();

  interaction.client.emit("activity", interaction.member, drops.promotionPoints);

  actionRow.setComponents(
    button
      .setCustomId("taken")
      .setLabel("taken")
      .setStyle(ButtonStyle.Danger)
      .setDisabled(true)
  );

  interaction.update({
    content: `*${interaction.member}* took the drop`,
    components: [actionRow]
  });
};

export { takePromotionPoints };

