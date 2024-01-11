/**
 * @param {import("discord.js").Interaction} interaction
 */
const clear = async (interaction) => {
  interaction.channel
    .bulkDelete(100)
    .then(interaction.reply("messages deleted"));
};

export { clear };