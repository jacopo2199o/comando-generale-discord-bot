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
  const message = new EmbedBuilder().setTitle(
    "📄 about"
  ).setTimestamp().setColor(
    "DarkGreen"
  );
  if (
    interaction.channel.isVoiceBased()
  ) {
    await interaction.editReply(
      "description is not available for voice channels"
    );
    return;
  } else if (
    interaction.channel.isThread()
  ) {
    message.setDescription(
      `${interaction.channel.parent.topic}`
    );
  } else {
    message.setDescription(
      `${interaction.channel.topic}`
    );
  }
  await interaction.editReply(
    {
      embeds: [
        message
      ]
    }
  );
}

export {
  about
};

