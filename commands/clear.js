/**
 * @param {import("discord.js").Interaction} interaction
 */
const clear = async (interaction) => {
  await interaction.deferReply();
  await interaction.channel.bulkDelete(100);
  await interaction.editReply("done");
};

export { clear };

