import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { drops } from "../resources/custom-points.js";

/**
 * @param {import("discord.js").Interaction} interaction 
 */
const takePromotionPoints = async (interaction) => {
  const button = new ButtonBuilder();
  button.setCustomId("taken");
  button.setLabel("taken");
  button.setStyle(ButtonStyle.Danger);
  button.setDisabled(true);
  
  const actionRow = new ActionRowBuilder();
  actionRow.setComponents(button);
  
  interaction.client.emit("activity", interaction.member, drops.promotionPoints);
  interaction.update({ content: `*${interaction.member}* took the drop`, components: [actionRow] });
};

export { takePromotionPoints };

