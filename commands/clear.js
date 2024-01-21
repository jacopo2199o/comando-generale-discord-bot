/**
 * @param {import("discord.js").Interaction} interaction
 */
const clear = async (interaction) => {
  await interaction.reply("removing... wait a second");

  await interaction.channel.bulkDelete(100);
};

export { clear };

