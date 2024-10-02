/**
 * @param {import("discord.js").Interaction} interaction
 */
async function clear(
  interaction
) {
  await interaction.reply("removing... please wait");
  await interaction.channel.bulkDelete(
    100
  );
}

export {
  clear
};

