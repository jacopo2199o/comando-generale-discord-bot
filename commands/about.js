/**
 * @param {import("discord.js").Interaction} interaction
 */
const about = async (interaction) => {
  await interaction.deferReply();

  if (interaction.channel.isThread()) {
    await interaction.editReply(interaction.channel.parent.topic);
  } else if (interaction.channel.isVoiceBased()){
    await interaction.editReply("description is not available for voice channels");
  } else {
    await interaction.editReply(interaction.channel.topic);
  }
};

export { about };