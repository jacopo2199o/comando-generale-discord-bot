import { promotionPoints } from "../events/ready.js";

/**
 * @param {import("discord.js").Interaction} interaction
 */
const viewPoints = async (interaction) => {
  const targetMember = interaction.options.getUser("member");
  
  await interaction.deferReply();

  if (targetMember) {
    await interaction.editReply(`*${targetMember.displayName}* have ${promotionPoints[targetMember.id]}/1000 ⭐ points\n`);
  } else {
    await interaction.editReply(`you have ${promotionPoints[interaction.member.id]}/1000 ⭐ points\n`);
  }
};

export { viewPoints };