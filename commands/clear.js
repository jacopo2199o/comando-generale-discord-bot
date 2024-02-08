/**
 * @param {import("discord.js").Interaction} interaction
 */
const clear = async (interaction) => {
  await interaction.reply("removing... please wait");
  await interaction.channel.bulkDelete(20);
};

export { clear };

