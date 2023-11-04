import { ChannelType, SlashCommandBuilder } from "discord.js";
import { communities } from "../events/ready.js";

const cooldown = 4; // modificalo per sbloccare il comando ogni ora
const data = new SlashCommandBuilder()
  .setName("set-preferences")
  .setDescription("set preferences for log channel and base role")
  .addChannelOption(option => option
    .setName("log-channel")
    .setDescription("log channel for notifications")
    .setRequired(true)
    .addChannelTypes(ChannelType.GuildText));

/**
 * @param {import("discord.js").Interaction} interaction
 */
const execute = async (interaction) => {
  await interaction.deferReply();

  /**
   * @type { import("../community.js").Community }
   */
  const community = communities.get(interaction.guildId);
  const set = (() => {
    const preferences = ((logChannel) => {
      return Object.freeze({ logChannel: interaction.options.getChannel(logChannel) });
    })("log-channel");
    return community.activity.setPreferences(preferences.logChannel);
  })();

  if (set !== "success") {
    await interaction.editReply("something went wrong");
  } else {
    await interaction.editReply("preferences saved");
  }
};

export {
  cooldown,
  data,
  execute
};