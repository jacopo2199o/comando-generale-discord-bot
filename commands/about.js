import { EmbedBuilder } from "discord.js";

/**
 * @param {import("discord.js").Interaction} interaction
 */
const about = async (interaction) => {
  const message = new EmbedBuilder();

  await interaction.deferReply();

  if (interaction.channel.isVoiceBased()) {
    await interaction.editReply("description is not available for voice channels");
  } else if (interaction.channel.isThread()) {
    message
      .setTitle("📄 about")
      .setDescription(`${interaction.channel.parent.topic}`)
      .setTimestamp()
      .setColor("DarkGreen");

    await interaction.editReply({ embeds: [message] });
  } else {
    message
      .setTitle("📄 about")
      .setDescription(`${interaction.channel.topic}`)
      .setTimestamp()
      .setColor("DarkGreen");

    await interaction.editReply({ embeds: [message] });
  }
};

export { about };

