/**
 * @param {import("discord.js").Interaction} interaction
 */
const clear = async (interaction) => {
  await interaction.deferReply();

  interaction.channel.bulkDelete(100)
    .then(await interaction.editReply("messages deleted"));
};

export { clear };