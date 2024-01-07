import { reputationPoints } from "../events/ready.js";

/**
 * @param {import("discord.js").Interaction} interaction
 */
const viewReputationPoints = async (interaction) => {
  const targetMember = interaction.options.getUser("member");

  await interaction.deferReply();

  if (targetMember) {
    await interaction.editReply(`*${targetMember.displayName}* have ${reputationPoints[targetMember.id].points} 🏵 reputation points\n`);
  } else {
    await interaction.editReply(`you have ${reputationPoints[interaction.member.id].points} 🏵 reputation points\n`);
  }
};

export { viewReputationPoints };