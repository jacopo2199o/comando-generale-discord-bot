import {
  EmbedBuilder
} from "discord.js";

/**
 * @param {import("discord.js").Interaction} interaction
 */
async function about(
  interaction
) {
  await interaction.deferReply();
  const message = new EmbedBuilder();
  if (
    interaction.channel.isVoiceBased()
  ) {
    await interaction.editReply("description is not available for voice channels");
  } else if (
    interaction.channel.isThread()
  ) {
    message.setTitle(
      "📄 about"
    );
    message.setDescription(
      `${interaction.channel.parent.topic}`
    );
    message.setTimestamp();
    message.setColor(
      "DarkGreen"
    );
    await interaction.editReply(
      {
        embeds: [
          message
        ]
      }
    );
  } else {
    message.setTitle(
      "📄 about"
    );
    message.setDescription(
      `${interaction.channel.topic}`
    );
    message.setTimestamp();
    message.setColor(
      "DarkGreen"
    );
    await interaction.editReply(
      {
        embeds: [
          message
        ]
      }
    );
  }
}

export {
  about
};

